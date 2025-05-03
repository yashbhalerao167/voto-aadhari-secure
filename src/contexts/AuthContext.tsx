
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  role: "voter" | "admin";
  isAuthenticated: boolean;
  walletAddress?: string;
  aadhaarVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyAadhaar: (aadhaarData: FormData) => Promise<boolean>;
  connectWallet: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Mock login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API delay
      
      // Mock validation
      if (username && password.length > 3) {
        const mockUser: User = {
          id: `voter-${Date.now()}`,
          name: username,
          role: "voter",
          isAuthenticated: true,
        };
        
        setUser(mockUser);
        localStorage.setItem("user", JSON.stringify(mockUser));
        toast.success("Logged in successfully");
        return true;
      } else {
        toast.error("Invalid credentials");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Admin login function
  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API delay
      
      // Mock admin validation - in production this would validate against a secure backend
      if (username === "admin" && password === "admin123") {
        const adminUser: User = {
          id: "admin-1",
          name: "Administrator",
          role: "admin",
          isAuthenticated: true,
        };
        
        setUser(adminUser);
        localStorage.setItem("user", JSON.stringify(adminUser));
        toast.success("Admin logged in successfully");
        return true;
      } else {
        toast.error("Invalid admin credentials");
        return false;
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Admin login failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
  };

  // Mock Aadhaar verification
  const verifyAadhaar = async (aadhaarData: FormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call to Aadhaar verification service
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API delay
      
      // In a real implementation, this would validate the Aadhaar card with government APIs
      if (user) {
        const updatedUser = { 
          ...user, 
          aadhaarVerified: true 
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Aadhaar verified successfully");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Aadhaar verification error:", error);
      toast.error("Aadhaar verification failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Connect MetaMask wallet
  const connectWallet = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      if (!window.ethereum) {
        toast.error("MetaMask is not installed. Please install MetaMask to continue.");
        return false;
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (accounts.length === 0) {
        toast.error("No accounts found. Please create an account in MetaMask.");
        return false;
      }
      
      const walletAddress = accounts[0];
      
      if (user) {
        const updatedUser = { 
          ...user, 
          walletAddress 
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Wallet connected successfully");
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast.error(error.message || "Failed to connect wallet");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    adminLogin,
    logout,
    verifyAadhaar,
    connectWallet
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
