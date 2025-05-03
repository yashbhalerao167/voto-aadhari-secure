
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { WalletConnect as WalletConnectComponent } from "@/components/verification/WalletConnect";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const WalletConnect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    // If not verified, redirect to verification
    if (!user.aadhaarVerified) {
      navigate("/verification");
      return;
    }

    // If already has wallet, redirect to voting
    if (user.walletAddress) {
      navigate("/vote");
    }
  }, [user, navigate]);

  // If user is not available yet (still loading), return empty
  if (!user) {
    return null;
  }

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Connect Your Wallet</h1>
        <WalletConnectComponent />
      </div>
    </MainLayout>
  );
};

export default WalletConnect;
