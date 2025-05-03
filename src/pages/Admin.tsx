
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockchain } from "@/contexts/BlockchainContext";

const Admin = () => {
  const { user } = useAuth();
  const { initialize, isInitialized } = useBlockchain();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in or not an admin, redirect to admin login
    if (!user || user.role !== "admin") {
      navigate("/admin-login");
      return;
    }

    // Initialize blockchain connection if not already done
    if (!isInitialized) {
      initialize();
    }
  }, [user, navigate, isInitialized, initialize]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <AdminDashboard />
      </div>
    </MainLayout>
  );
};

export default Admin;
