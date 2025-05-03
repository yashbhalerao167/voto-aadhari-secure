
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { BarChart3, CheckCircle2, Users, Vote } from "lucide-react";

export function AdminStats() {
  const { candidates, totalVotes, electionState } = useBlockchain();
  
  const stats = [
    { 
      title: "Total Candidates", 
      value: candidates.length, 
      icon: <Users className="h-4 w-4 text-blue-600" />,
      color: "text-blue-600"
    },
    { 
      title: "Total Votes Cast", 
      value: totalVotes, 
      icon: <Vote className="h-4 w-4 text-green-600" />,
      color: "text-green-600"
    },
    { 
      title: "Highest Votes", 
      value: candidates.length > 0 ? Math.max(...candidates.map(c => c.voteCount)) : 0, 
      icon: <BarChart3 className="h-4 w-4 text-purple-600" />,
      color: "text-purple-600"
    },
    { 
      title: "Election Status", 
      value: electionState === 0 ? "Not Started" : electionState === 1 ? "In Progress" : "Ended", 
      icon: <CheckCircle2 className="h-4 w-4 text-amber-600" />,
      color: electionState === 0 ? "text-amber-600" : electionState === 1 ? "text-green-600" : "text-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
