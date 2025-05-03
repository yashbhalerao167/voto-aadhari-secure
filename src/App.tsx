
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { BlockchainProvider } from "@/contexts/BlockchainContext";

import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import Verification from "./pages/Verification";
import WalletConnect from "./pages/WalletConnect";
import Vote from "./pages/Vote";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Additional type declaration for MetaMask window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BlockchainProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/wallet-connect" element={<WalletConnect />} />
              <Route path="/vote" element={<Vote />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BlockchainProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
