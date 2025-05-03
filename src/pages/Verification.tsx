
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AadhaarVerification } from "@/components/verification/AadhaarVerification";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const Verification = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    // If already verified and has wallet, redirect to voting
    if (user.aadhaarVerified && user.walletAddress) {
      navigate("/vote");
    }
    // If already verified but no wallet, go to wallet connect
    else if (user.aadhaarVerified) {
      navigate("/wallet-connect");
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Verify Your Identity</h1>
        <AadhaarVerification />
      </div>
    </MainLayout>
  );
};

export default Verification;
