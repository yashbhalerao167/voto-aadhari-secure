
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { useState } from "react";

interface Candidate {
  id: number;
  name: string;
  party: string;
  imageUrl: string;
  voteCount: number;
}

interface CandidateCardProps {
  candidate: Candidate;
  onVoteSubmitted: () => void;
  showResults?: boolean;
  totalVotes?: number;
}

export function CandidateCard({ 
  candidate, 
  onVoteSubmitted,
  showResults = false,
  totalVotes = 0
}: CandidateCardProps) {
  const { voteForCandidate, hasUserVoted, electionState } = useBlockchain();
  const [isVoting, setIsVoting] = useState(false);
  
  const handleVote = async () => {
    setIsVoting(true);
    try {
      const success = await voteForCandidate(candidate.id);
      if (success) {
        onVoteSubmitted();
      }
    } finally {
      setIsVoting(false);
    }
  };

  // Calculate vote percentage
  const votePercentage = totalVotes > 0 
    ? Math.round((candidate.voteCount / totalVotes) * 100) 
    : 0;

  return (
    <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative pt-[56.25%] overflow-hidden bg-gray-100">
        <img 
          src={candidate.imageUrl} 
          alt={candidate.name}
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <CardContent className="flex-grow p-4">
        <h3 className="text-lg font-semibold">{candidate.name}</h3>
        <p className="text-sm text-gray-600">{candidate.party}</p>
        
        {showResults && (
          <div className="mt-4">
            <div className="flex justify-between text-sm">
              <span>Votes: {candidate.voteCount}</span>
              <span>{votePercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-vote-primary h-2 rounded-full" 
                style={{ width: `${votePercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {!showResults && (
          <Button 
            onClick={handleVote}
            disabled={hasUserVoted || isVoting || electionState !== 1}
            className="w-full"
          >
            {isVoting ? (
              <span className="animate-pulse-light">Casting Vote...</span>
            ) : hasUserVoted ? (
              "Already Voted"
            ) : electionState !== 1 ? (
              "Voting Closed"
            ) : (
              "Vote for Candidate"
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
