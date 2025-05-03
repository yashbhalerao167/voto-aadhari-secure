
import { useState, useEffect } from "react";
import { CandidateCard } from "./CandidateCard";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function VotingSection() {
  const { candidates, hasUserVoted, refreshCandidates, totalVotes, electionState } = useBlockchain();
  const [activeTab, setActiveTab] = useState<string>(hasUserVoted ? "results" : "vote");

  useEffect(() => {
    // If user has voted, switch to results tab
    if (hasUserVoted) {
      setActiveTab("results");
    }
  }, [hasUserVoted]);

  const handleVoteSubmitted = async () => {
    await refreshCandidates();
    setActiveTab("results");
  };

  return (
    <div className="space-y-6">
      {electionState === 0 && (
        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
          <AlertTitle>Voting has not started yet</AlertTitle>
          <AlertDescription>
            The election has not been started by the administrator. Please check back later.
          </AlertDescription>
        </Alert>
      )}

      {electionState === 2 && (
        <Alert variant="default" className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertTitle>Voting has ended</AlertTitle>
          <AlertDescription>
            The election has concluded. You can view the results below.
          </AlertDescription>
        </Alert>
      )}

      {hasUserVoted && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <AlertTitle>Your vote has been recorded</AlertTitle>
          <AlertDescription>
            Thank you for participating in this election. Your vote has been securely recorded on the blockchain.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vote" disabled={hasUserVoted || electionState === 2}>Cast Your Vote</TabsTrigger>
          <TabsTrigger value="results">View Results</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vote" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <CandidateCard 
                key={candidate.id} 
                candidate={candidate} 
                onVoteSubmitted={handleVoteSubmitted} 
              />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="results" className="pt-4">
          <div className="mb-4 text-center">
            <h3 className="text-xl font-medium mb-1">Election Results</h3>
            <p className="text-gray-600">Total votes cast: {totalVotes}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates
              .slice()
              .sort((a, b) => b.voteCount - a.voteCount)
              .map((candidate) => (
                <CandidateCard 
                  key={candidate.id} 
                  candidate={candidate} 
                  onVoteSubmitted={handleVoteSubmitted}
                  showResults={true}
                  totalVotes={totalVotes}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
