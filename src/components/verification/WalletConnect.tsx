
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export function WalletConnect() {
  const { user, connectWallet } = useAuth();
  const { initialize, isInitialized } = useBlockchain();
  const navigate = useNavigate();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [hasMetaMask, setHasMetaMask] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if metamask is installed
    const checkMetaMask = async () => {
      const isMetaMaskInstalled = typeof window !== "undefined" && window.ethereum !== undefined;
      setHasMetaMask(isMetaMaskInstalled);
      
      if (!isMetaMaskInstalled) {
        toast.error("MetaMask is not installed. Please install MetaMask to continue.");
      }
    };

    checkMetaMask();

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
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
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
        
        {hasMetaMask === false ? (
          <Alert variant="destructive" className="bg-red-50 border border-red-200 text-red-800">
            <Info className="h-5 w-5" />
            <AlertDescription>
              MetaMask is not installed. Please install the <a 
                href="https://metamask.io/download/" 
                target="_blank" 
                rel="noreferrer" 
                className="underline font-medium"
              >
                MetaMask extension
              </a> first to continue.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
            <p className="text-sm text-amber-700">
              <strong>Important:</strong> Your Aadhaar will be linked to this MetaMask wallet address for secure voting. Make sure you're connecting the correct account.
            </p>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Test Network:</strong> This application uses a test blockchain network for voting. If prompted by MetaMask, please switch to the test network.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleConnectWallet} 
          className="w-full bg-[#E2761B] hover:bg-[#C66410] text-white"
          disabled={isConnecting || isInitializing || hasMetaMask === false}
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
