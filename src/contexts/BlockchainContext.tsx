
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { useAuth } from "./AuthContext";

// Mock Election contract ABI - this would be generated from the actual Solidity contract
const ElectionABI = [
  "function getCandidateCount() view returns (uint256)",
  "function getCandidate(uint256 candidateId) view returns (uint256 id, string name, string party, string imageUrl, uint256 voteCount)",
  "function addCandidate(string name, string party, string imageUrl)",
  "function vote(uint256 candidateId)",
  "function hasVoted(address voter) view returns (bool)",
  "function getTotalVotes() view returns (uint256)",
  "function getElectionState() view returns (uint8)", // 0: Not Started, 1: In Progress, 2: Ended
  "function startElection()",
  "function endElection()",
  "event CandidateAdded(uint256 indexed candidateId, string name)",
  "event Voted(address indexed voter, uint256 indexed candidateId)",
  "event ElectionStateChanged(uint8 state)"
];

// Mock candidate type
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

// Mock contract address - in production this would be the deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

interface BlockchainProviderProps {
  children: ReactNode;
}

// Define the additional properties on the window object
declare global {
  interface Window {
    ethereum?: any;
  }
}

export const BlockchainProvider = ({ children }: BlockchainProviderProps) => {
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState<ethers.Provider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [totalVotes, setTotalVotes] = useState(0);
  const [electionState, setElectionState] = useState<ElectionState>(ElectionState.NotStarted);

  // Mock candidates for development
  const mockCandidates: Candidate[] = [
    { id: 1, name: "Alice Johnson", party: "Progressive Party", imageUrl: "/placeholder.svg", voteCount: 42 },
    { id: 2, name: "Bob Smith", party: "Conservative Party", imageUrl: "/placeholder.svg", voteCount: 38 },
    { id: 3, name: "Carol Williams", party: "Centrist Alliance", imageUrl: "/placeholder.svg", voteCount: 27 },
  ];

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

      // In production, we would connect to the actual contract
      // For now, we'll just simulate it with our mock data
      // const signer = await ethersProvider.getSigner();
      // const electionContract = new ethers.Contract(CONTRACT_ADDRESS, ElectionABI, signer);
      // setContract(electionContract);

      setIsInitialized(true);
      setIsConnected(true);
      
      // Set mock candidates
      setCandidates(mockCandidates);
      
      // Mock election state
      setElectionState(ElectionState.InProgress);
      
      // Mock total votes
      setTotalVotes(mockCandidates.reduce((sum, candidate) => sum + candidate.voteCount, 0));
      
      toast.success("Blockchain connection initialized");
      return true;
    } catch (error: any) {
      console.error("Blockchain initialization error:", error);
      toast.error(error.message || "Failed to initialize blockchain connection");
      return false;
    }
  };

  // Check if user has voted
  const checkIfUserVoted = useCallback(async () => {
    if (isConnected && user?.walletAddress) {
      try {
        // In production, this would call the contract method
        // const voted = await contract.hasVoted(user.walletAddress);
        // setHasUserVoted(voted);
        
        // For now, just set a mock value
        setHasUserVoted(false);
      } catch (error) {
        console.error("Error checking if user voted:", error);
      }
    }
  }, [isConnected, user]);

  // Refresh candidates list
  const refreshCandidates = async (): Promise<Candidate[]> => {
    try {
      // In production, this would fetch from the blockchain
      // const count = await contract.getCandidateCount();
      // const fetchedCandidates = [];
      // for (let i = 1; i <= count; i++) {
      //   const candidate = await contract.getCandidate(i);
      //   fetchedCandidates.push({
      //     id: candidate.id.toNumber(),
      //     name: candidate.name,
      //     party: candidate.party,
      //     imageUrl: candidate.imageUrl,
      //     voteCount: candidate.voteCount.toNumber()
      //   });
      // }
      // setCandidates(fetchedCandidates);
      // return fetchedCandidates;
      
      // For mock data, just return the existing mock candidates
      return mockCandidates;
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

      // In production, this would call the contract method
      // await contract.addCandidate(name, party, imageUrl);
      
      // For now, just add to our mock data
      const newId = candidates.length + 1;
      const newCandidate: Candidate = {
        id: newId,
        name,
        party,
        imageUrl: imageUrl || "/placeholder.svg",
        voteCount: 0
      };
      
      setCandidates([...candidates, newCandidate]);
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

      // In production, this would call the contract method
      // await contract.vote(candidateId);
      
      // For now, just update our mock data
      const updatedCandidates = candidates.map(candidate => {
        if (candidate.id === candidateId) {
          return { ...candidate, voteCount: candidate.voteCount + 1 };
        }
        return candidate;
      });
      
      setCandidates(updatedCandidates);
      setHasUserVoted(true);
      setTotalVotes(totalVotes + 1);
      
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

      // In production, this would call the contract method
      // await contract.startElection();
      
      // For now, just update our state
      setElectionState(ElectionState.InProgress);
      toast.success("Election started successfully");
      return true;
    } catch (error: any) {
      console.error("Error starting election:", error);
      toast.error(error.message || "Failed to start election");
      return false;
    }
  };

  // End the election (admin only)
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

      // In production, this would call the contract method
      // await contract.endElection();
      
      // For now, just update our state
      setElectionState(ElectionState.Ended);
      toast.success("Election ended successfully");
      return true;
    } catch (error: any) {
      console.error("Error ending election:", error);
      toast.error(error.message || "Failed to end election");
      return false;
    }
  };

  // Check if user has voted when wallet address changes
  useEffect(() => {
    if (isInitialized && user?.walletAddress) {
      checkIfUserVoted();
    }
  }, [isInitialized, user?.walletAddress, checkIfUserVoted]);

  const value = {
    isInitialized,
    isConnected,
    provider,
    contract,
    candidates,
    hasUserVoted,
    totalVotes,
    electionState,
    initialize,
    refreshCandidates,
    addCandidate,
    voteForCandidate,
    startElection,
    endElection
  };

  return <BlockchainContext.Provider value={value}>{children}</BlockchainContext.Provider>;
};
