
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";

export function WalletConnect() {
  const { user, connectWallet } = useAuth();
  const { initialize } = useBlockchain();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Redirect to voting page if wallet is already connected
    if (user?.walletAddress) {
      navigate("/vote");
    }
  }, [user, navigate]);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    
    try {
      const success = await connectWallet();
      if (success) {
        toast.success("Wallet connected successfully");
        
        // Initialize blockchain connection
        setIsInitializing(true);
        const blockchainSuccess = await initialize();
        
        if (blockchainSuccess) {
          navigate("/vote");
        } else {
          toast.error("Failed to initialize blockchain connection");
        }
      }
    } finally {
      setIsConnecting(false);
      setIsInitializing(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Connect Your Wallet</CardTitle>
        <CardDescription className="text-center">
          Link your MetaMask wallet to securely cast your vote on the blockchain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
            alt="MetaMask"
            className="w-32 h-32"
          />
        </div>
        
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-sm text-amber-700">
            <strong>Important:</strong> You need to have MetaMask installed to connect your wallet. If you don't have it yet, please install the MetaMask extension first.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConnectWallet} 
          className="w-full bg-[#E2761B] hover:bg-[#C66410] text-white"
          disabled={isConnecting || isInitializing}
        >
          {isConnecting ? (
            <span className="animate-pulse-light">Connecting Wallet...</span>
          ) : isInitializing ? (
            <span className="animate-pulse-light">Initializing Blockchain...</span>
          ) : (
            "Connect MetaMask"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
