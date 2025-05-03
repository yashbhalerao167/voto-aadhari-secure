
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { VotingSection } from "@/components/voting/VotingSection";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const Vote = () => {
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

    // If no wallet connected, redirect to wallet connect
    if (!user.walletAddress) {
      navigate("/wallet-connect");
      return;
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cast Your Vote</h1>
        <VotingSection />
      </div>
    </MainLayout>
  );
};

export default Vote;
