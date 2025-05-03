
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignupForm } from "@/components/authentication/SignupForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect to the appropriate page
    if (user) {
      if (!user.aadhaarVerified) {
        navigate("/verification");
      } else if (!user.walletAddress) {
        navigate("/wallet-connect");
      } else {
        navigate("/vote");
      }
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Create Voter Account</h1>
        <SignupForm />
      </div>
    </MainLayout>
  );
};

export default Signup;
