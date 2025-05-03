
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Candidate interface
interface Candidate {
  id: number;
  name: string;
  party: string;
  imageUrl: string;
  voteCount: number;
}

enum ElectionState {
  NotStarted,
  InProgress,
  Ended
}

interface BlockchainContextType {
  isInitialized: boolean;
  isConnected: boolean;
  provider: ethers.Provider | null;
  contract: ethers.Contract | null;
  candidates: Candidate[];
  hasUserVoted: boolean;
  totalVotes: number;
  electionState: ElectionState;
  winner: Candidate | null;
  initialize: () => Promise<boolean>;
  refreshCandidates: () => Promise<Candidate[]>;
  addCandidate: (name: string, party: string, imageUrl: string) => Promise<boolean>;
  voteForCandidate: (candidateId: number) => Promise<boolean>;
  startElection: () => Promise<boolean>;
  endElection: () => Promise<boolean>;
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined);

export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider");
  }
  return context;
};

// Mock contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

interface BlockchainProviderProps {
  children: ReactNode;
}

// Define window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const { user, updateUserVoteStatus } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [electionState, setElectionState] = useState<ElectionState>(ElectionState.NotStarted);
  const [winner, setWinner] = useState<Candidate | null>(null);

  // Initialize local storage
  useEffect(() => {
    // Initialize candidates from local storage or with defaults
    const storedCandidates = localStorage.getItem("candidates");
    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates));
    }

    // Initialize election state from local storage or with defaults
    const storedElectionState = localStorage.getItem("electionState");
    if (storedElectionState) {
      setElectionState(parseInt(storedElectionState));
    } else {
      // Default to "Not Started"
      localStorage.setItem("electionState", ElectionState.NotStarted.toString());
    }

    // Initialize total votes from local storage or with defaults
    const storedTotalVotes = localStorage.getItem("totalVotes");
    if (storedTotalVotes) {
      setTotalVotes(parseInt(storedTotalVotes));
    } else {
      localStorage.setItem("totalVotes", "0");
    }

    // Initialize winner from local storage
    const storedWinner = localStorage.getItem("winner");
    if (storedWinner) {
      setWinner(JSON.parse(storedWinner));
    }
  }, []);

  // Check if user has voted when user changes
  useEffect(() => {
    if (user) {
      setHasUserVoted(!!user.hasVoted);
    }
  }, [user]);

  // Initialize blockchain connection
  const initialize = async (): Promise<boolean> => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed. Please install MetaMask to continue.");
        return false;
      }

      // Connect to Ethereum network via MetaMask
      const ethersProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(ethersProvider);
      
      // Load local data
      loadLocalData();

      setIsInitialized(true);
      setIsConnected(true);
      
      toast.success("Blockchain connection initialized");
      return true;
    } catch (error: any) {
      console.error("Blockchain initialization error:", error);
      toast.error(error.message || "Failed to initialize blockchain connection");
      return false;
    }
  };

  // Load data from local storage
  const loadLocalData = () => {
    // Load candidates
    const storedCandidates = localStorage.getItem("candidates");
    if (storedCandidates) {
      setCandidates(JSON.parse(storedCandidates));
    } else {
      // Set default empty candidates array
      localStorage.setItem("candidates", JSON.stringify([]));
    }

    // Load election state
    const storedElectionState = localStorage.getItem("electionState");
    if (storedElectionState) {
      setElectionState(parseInt(storedElectionState));
    }

    // Load total votes
    const storedTotalVotes = localStorage.getItem("totalVotes");
    if (storedTotalVotes) {
      setTotalVotes(parseInt(storedTotalVotes));
    }

    // Load winner if election has ended
    if (parseInt(storedElectionState || "0") === ElectionState.Ended) {
      const storedWinner = localStorage.getItem("winner");
      if (storedWinner) {
        setWinner(JSON.parse(storedWinner));
      }
    }
  };

  // Refresh candidates list
  const refreshCandidates = async (): Promise<Candidate[]> => {
    try {
      const storedCandidates = localStorage.getItem("candidates");
      if (storedCandidates) {
        const candidateList = JSON.parse(storedCandidates);
        setCandidates(candidateList);
        return candidateList;
      }
      return [];
    } catch (error) {
      console.error("Error refreshing candidates:", error);
      return [];
    }
  };

  // Add a new candidate (admin only)
  const addCandidate = async (name: string, party: string, imageUrl: string): Promise<boolean> => {
    try {
      if (!isConnected) {
        toast.error("Blockchain not connected");
        return false;
      }

      if (user?.role !== "admin") {
        toast.error("Only admins can add candidates");
        return false;
      }

      // Get existing candidates
      const storedCandidates = localStorage.getItem("candidates");
      const existingCandidates = storedCandidates ? JSON.parse(storedCandidates) : [];
      
      // Create new candidate
      const newId = existingCandidates.length > 0 
        ? Math.max(...existingCandidates.map((c: Candidate) => c.id)) + 1 
        : 1;
        
      const newCandidate: Candidate = {
        id: newId,
        name,
        party,
        imageUrl: imageUrl || "/placeholder.svg",
        voteCount: 0
      };
      
      // Add to candidates list
      const updatedCandidates = [...existingCandidates, newCandidate];
      localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
      
      setCandidates(updatedCandidates);
      toast.success(`Candidate ${name} added successfully`);
      return true;
    } catch (error: any) {
      console.error("Error adding candidate:", error);
      toast.error(error.message || "Failed to add candidate");
      return false;
    }
  };

  // Vote for a candidate
  const voteForCandidate = async (candidateId: number): Promise<boolean> => {
    try {
      if (!isConnected) {
        toast.error("Blockchain not connected");
        return false;
      }

      if (!user?.walletAddress) {
        toast.error("Wallet not connected");
        return false;
      }

      if (!user.aadhaarVerified) {
        toast.error("Aadhaar verification required before voting");
        return false;
      }

      if (hasUserVoted) {
        toast.error("You have already voted");
        return false;
      }

      if (electionState !== ElectionState.InProgress) {
        toast.error("Voting is not currently active");
        return false;
      }

      // Get existing candidates
      const storedCandidates = localStorage.getItem("candidates");
      const existingCandidates: Candidate[] = storedCandidates ? JSON.parse(storedCandidates) : [];
      
      // Find candidate and update vote count
      const candidateExists = existingCandidates.some(c => c.id === candidateId);
      if (!candidateExists) {
        toast.error("Invalid candidate ID");
        return false;
      }
      
      // Update candidate vote count
      const updatedCandidates = existingCandidates.map(candidate => {
        if (candidate.id === candidateId) {
          return { ...candidate, voteCount: candidate.voteCount + 1 };
        }
        return candidate;
      });
      
      // Update total votes
      const newTotalVotes = totalVotes + 1;
      
      // Save updated candidates
      localStorage.setItem("candidates", JSON.stringify(updatedCandidates));
      localStorage.setItem("totalVotes", newTotalVotes.toString());
      
      // Update state
      setCandidates(updatedCandidates);
      setTotalVotes(newTotalVotes);
      setHasUserVoted(true);
      
      // Update user's vote status
      updateUserVoteStatus(true);
      
      toast.success("Vote cast successfully");
      return true;
    } catch (error: any) {
      console.error("Error voting:", error);
      toast.error(error.message || "Failed to cast vote");
      return false;
    }
  };

  // Start the election (admin only)
  const startElection = async (): Promise<boolean> => {
    try {
      if (!isConnected) {
        toast.error("Blockchain not connected");
        return false;
      }

      if (user?.role !== "admin") {
        toast.error("Only admins can start the election");
        return false;
      }

      if (electionState !== ElectionState.NotStarted) {
        toast.error("Election has already started or ended");
        return false;
      }

      // Check if there are candidates
      const storedCandidates = localStorage.getItem("candidates");
      const existingCandidates = storedCandidates ? JSON.parse(storedCandidates) : [];
      if (existingCandidates.length === 0) {
        toast.error("Cannot start election with no candidates. Add candidates first.");
        return false;
      }
      
      // Update election state
      localStorage.setItem("electionState", ElectionState.InProgress.toString());
      setElectionState(ElectionState.InProgress);
      
      toast.success("Election started successfully");
      return true;
    } catch (error: any) {
      console.error("Error starting election:", error);
      toast.error(error.message || "Failed to start election");
      return false;
    }
  };

  // End the election and determine winner (admin only)
  const endElection = async (): Promise<boolean> => {
    try {
      if (!isConnected) {
        toast.error("Blockchain not connected");
        return false;
      }

      if (user?.role !== "admin") {
        toast.error("Only admins can end the election");
        return false;
      }

      if (electionState !== ElectionState.InProgress) {
        toast.error("Election is not in progress");
        return false;
      }

      // Update election state
      localStorage.setItem("electionState", ElectionState.Ended.toString());
      setElectionState(ElectionState.Ended);
      
      // Determine the winner
      const storedCandidates = localStorage.getItem("candidates");
      const existingCandidates: Candidate[] = storedCandidates ? JSON.parse(storedCandidates) : [];
      
      if (existingCandidates.length > 0) {
        const sortedCandidates = [...existingCandidates].sort((a, b) => b.voteCount - a.voteCount);
        const winningCandidate = sortedCandidates[0];
        
        // Save winner to local storage
        localStorage.setItem("winner", JSON.stringify(winningCandidate));
        setWinner(winningCandidate);
      }
      
      toast.success("Election ended successfully");
      return true;
    } catch (error: any) {
      console.error("Error ending election:", error);
      toast.error(error.message || "Failed to end election");
      return false;
    }
  };

  const value = {
    isInitialized,
    isConnected,
    provider,
    contract,
    candidates,
    hasUserVoted,
    totalVotes,
    electionState,
    winner,
    initialize,
    refreshCandidates,
    addCandidate,
    voteForCandidate,
    startElection,
    endElection
  };

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
};
