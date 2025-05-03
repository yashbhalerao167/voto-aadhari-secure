
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AdminStats } from "./AdminStats";
import { CandidateManagement } from "./CandidateManagement";
import { ResultsChart } from "./ResultsChart";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { BarChart, PieChart, Trophy, Users } from "lucide-react";

export function AdminDashboard() {
  const { user } = useAuth();
  const { electionState, startElection, endElection, winner, totalVotes } = useBlockchain();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const handleStartElection = async () => {
    setIsProcessing(true);
    await startElection();
    setIsProcessing(false);
  };

  const handleEndElection = async () => {
    setIsProcessing(true);
    await endElection();
    setIsProcessing(false);
  };

  const getElectionStatusText = () => {
    switch (electionState) {
      case 0: return "Not Started";
      case 1: return "In Progress";
      case 2: return "Ended";
      default: return "Unknown";
    }
  };

  const getElectionStatusColor = () => {
    switch (electionState) {
      case 0: return "text-amber-600";
      case 1: return "text-green-600";
      case 2: return "text-red-600";
      default: return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Admin Dashboard</h1>
          <p className="text-gray-600">
            Manage election, candidates, and view results
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Election Status</p>
            <p className={`font-medium ${getElectionStatusColor()}`}>
              {getElectionStatusText()}
            </p>
          </div>
          
          {electionState === 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="default" disabled={isProcessing}>
                  Start Election
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Start the election?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will open the voting process and allow voters to cast their votes.
                    Make sure all candidates have been added before starting.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button onClick={handleStartElection} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "Start Election"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          
          {electionState === 1 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isProcessing}>
                  End Election
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>End the election?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will close the voting process permanently. Voters will no longer be able to cast votes.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <Button variant="destructive" onClick={handleEndElection} disabled={isProcessing}>
                    {isProcessing ? "Processing..." : "End Election"}
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
      
      {electionState === 2 && winner && (
        <Alert className="bg-green-50 border-green-200">
          <Trophy className="h-5 w-5 text-green-600" />
          <AlertTitle className="text-green-800">Election Winner: {winner.name}</AlertTitle>
          <AlertDescription className="text-green-700">
            From {winner.party} with {winner.voteCount} votes ({totalVotes > 0 ? ((winner.voteCount / totalVotes) * 100).toFixed(2) : 0}% of total votes)
          </AlertDescription>
        </Alert>
      )}
      
      <AdminStats />
      
      <Tabs defaultValue="candidates" className="w-full">
        <TabsList>
          <TabsTrigger value="candidates" className="flex items-center gap-2">
            <Users size={16} />
            Candidates
          </TabsTrigger>
          <TabsTrigger value="pie" className="flex items-center gap-2">
            <PieChart size={16} />
            Pie Chart
          </TabsTrigger>
          <TabsTrigger value="bar" className="flex items-center gap-2">
            <BarChart size={16} />
            Bar Chart
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidates" className="pt-6">
          <CandidateManagement />
        </TabsContent>
        
        <TabsContent value="pie" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vote Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div style={{ width: '100%', height: '400px' }}>
                <ResultsChart type="pie" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="bar" className="pt-6">
          <Card>
            <CardHeader>
              <CardTitle>Vote Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div style={{ width: '100%', height: '400px' }}>
                <ResultsChart type="bar" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
