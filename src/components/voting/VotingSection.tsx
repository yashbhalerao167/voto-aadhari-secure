
import { useState, useEffect } from "react";
import { CandidateCard } from "./CandidateCard";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, AlertTriangle, CheckCircle, Trophy } from "lucide-react";

export function VotingSection() {
  const { candidates, hasUserVoted, refreshCandidates, totalVotes, electionState, winner, networkName } = useBlockchain();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("vote");
  const isAdmin = user?.role === "admin";
  
  useEffect(() => {
    // If user has voted or election has ended, switch to results tab
    if (hasUserVoted || electionState === 2) {
      setActiveTab("results");
    } else {
      setActiveTab("vote");
    }
    
    // Refresh candidates on mount
    refreshCandidates();
  }, [hasUserVoted, electionState, refreshCandidates]);
  
  const handleVoteSubmitted = async () => {
    await refreshCandidates();
    setActiveTab("results");
  };

  return (
    <div className="space-y-6">
      {networkName && (
        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
          <Info className="h-5 w-5" />
          <AlertTitle>Connected to {networkName}</AlertTitle>
          <AlertDescription>
            Your wallet is connected to {networkName}. All voting transactions will be recorded on this network.
          </AlertDescription>
        </Alert>
      )}
      
      {electionState === 0 && (
        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
          <Info className="h-5 w-5" />
          <AlertTitle>Voting has not started yet</AlertTitle>
          <AlertDescription>
            The election administrator has not yet started the voting process. Please check back later when the election begins.
          </AlertDescription>
        </Alert>
      )}

      {electionState === 1 && !hasUserVoted && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <Info className="h-5 w-5" />
          <AlertTitle>Voting is in progress</AlertTitle>
          <AlertDescription>
            You can now cast your vote for your preferred candidate. Remember, you can only vote once.
          </AlertDescription>
        </Alert>
      )}

      {electionState === 2 && (
        <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle>Voting has ended</AlertTitle>
          <AlertDescription>
            The election has concluded. You can view the results below.
          </AlertDescription>
        </Alert>
      )}

      {electionState === 2 && winner && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <Trophy className="h-5 w-5" />
          <AlertTitle>Election Winner: {winner.name}</AlertTitle>
          <AlertDescription>
            From {winner.party} with {winner.voteCount} votes ({totalVotes > 0 ? ((winner.voteCount / totalVotes) * 100).toFixed(2) : 0}% of total votes)
          </AlertDescription>
        </Alert>
      )}

      {hasUserVoted && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle className="h-5 w-5" />
          <AlertTitle>Your vote has been recorded</AlertTitle>
          <AlertDescription>
            Thank you for participating in this election. Your vote has been securely recorded on the blockchain.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger 
            value="vote" 
            disabled={hasUserVoted || electionState !== 1}
          >
            Cast Your Vote
          </TabsTrigger>
          <TabsTrigger 
            value="results"
          >
            {electionState === 2 ? "View Results" : (hasUserVoted ? "Your Vote Recorded" : "Preview Ballot")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="vote" className="pt-4">
          {electionState !== 1 ? (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-medium">Voting is not active</h3>
              <p className="text-gray-600 mt-2">
                {electionState === 0 
                  ? "The election has not started yet. Please wait for the administrator to start the election."
                  : "The election has ended. You can view the results in the Results tab."}
              </p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-8">
              <Info className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-medium">No candidates available</h3>
              <p className="text-gray-600 mt-2">
                There are no candidates in this election yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates.map((candidate) => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  onVoteSubmitted={handleVoteSubmitted} 
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="results" className="pt-4">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-medium mb-1">
              {electionState === 2 ? "Election Results" : (hasUserVoted ? "Your Vote Has Been Recorded" : "Preview Ballot")}
            </h3>
            {(isAdmin || electionState === 2) && totalVotes > 0 && (
              <p className="text-gray-600">Total votes cast: {totalVotes}</p>
            )}
          </div>
          
          {candidates.length === 0 ? (
            <div className="text-center py-8">
              <Info className="mx-auto h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-medium">No candidates available</h3>
              <p className="text-gray-600 mt-2">
                There are no candidates in this election yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {candidates
                .slice()
                .sort((a, b) => b.voteCount - a.voteCount)
                .map((candidate) => (
                  <CandidateCard 
                    key={candidate.id} 
                    candidate={candidate} 
                    onVoteSubmitted={handleVoteSubmitted}
                    showResults={isAdmin || electionState === 2}
                    totalVotes={totalVotes}
                  />
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
