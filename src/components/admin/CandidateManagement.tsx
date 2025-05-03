
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, UserPlus } from "lucide-react";

export function CandidateManagement() {
  const { candidates, addCandidate, electionState } = useBlockchain();
  
  const [name, setName] = useState("");
  const [party, setParty] = useState("");
  const [imageUrl, setImageUrl] = useState("/placeholder.svg");
  const [isAdding, setIsAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !party) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsAdding(true);
    
    try {
      const success = await addCandidate(name, party, imageUrl);
      
      if (success) {
        setName("");
        setParty("");
        setImageUrl("/placeholder.svg");
        setDialogOpen(false);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const isAddingDisabled = electionState !== 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Current Candidates</h2>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              disabled={isAddingDisabled} 
              className="flex items-center gap-2"
            >
              <UserPlus size={16} />
              Add Candidate
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Candidate</DialogTitle>
              <DialogDescription>
                Enter the candidate details below to add them to the election.
                {isAddingDisabled && (
                  <p className="text-red-500 mt-2">
                    Candidates can only be added before the election starts.
                  </p>
                )}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleAddCandidate}>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Candidate Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter full name"
                    disabled={isAddingDisabled || isAdding}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="party">Political Party</Label>
                  <Input
                    id="party"
                    value={party}
                    onChange={(e) => setParty(e.target.value)}
                    placeholder="Enter party name"
                    disabled={isAddingDisabled || isAdding}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL (optional)</Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    disabled={isAddingDisabled || isAdding}
                  />
                </div>
              </div>
              
              <DialogFooter className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isAddingDisabled || isAdding}
                >
                  {isAdding ? "Adding..." : "Add Candidate"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      {candidates.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-4">
              <Plus className="h-12 w-12 text-gray-400" />
            </div>
            <CardTitle className="text-xl mb-2">No Candidates Yet</CardTitle>
            <CardDescription>
              Start by adding candidates for the upcoming election.
            </CardDescription>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => setDialogOpen(true)}
              disabled={isAddingDisabled}
            >
              Add Your First Candidate
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Party</TableHead>
                <TableHead className="text-right">Votes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.id}</TableCell>
                  <TableCell>
                    <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                      <img 
                        src={candidate.imageUrl} 
                        alt={candidate.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>{candidate.name}</TableCell>
                  <TableCell>{candidate.party}</TableCell>
                  <TableCell className="text-right">{candidate.voteCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
