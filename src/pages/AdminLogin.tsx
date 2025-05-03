
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLoginForm } from "@/components/authentication/AdminLoginForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";

const AdminLogin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in as admin, redirect to admin dashboard
    if (user && user.role === "admin") {
      navigate("/admin");
    }
  }, [user, navigate]);

  return (
    <MainLayout>
      <div className="max-w-md mx-auto py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Access</h1>
        <AdminLoginForm />
      </div>
    </MainLayout>
  );
};

export default AdminLogin;
