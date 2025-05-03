
import React, { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  username: string;
  role: "voter" | "admin";
  isAuthenticated: boolean;
  walletAddress?: string;
  aadhaarVerified?: boolean;
  aadhaarNumber?: string;
  hasVoted?: boolean;
}

interface StoredUser {
  username: string;
  password: string;
  name: string;
  aadhaarVerified?: boolean;
  aadhaarNumber?: string;
  walletAddress?: string;
  hasVoted?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string, name: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  verifyAadhaar: (aadhaarData: FormData) => Promise<boolean>;
  connectWallet: () => Promise<boolean>;
  updateUserVoteStatus: (hasVoted: boolean) => void;
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
    
    // Initialize default admin user if it doesn't exist
    initializeAdminUser();
    
    setIsLoading(false);
  }, []);

  // Initialize admin user if not already set
  const initializeAdminUser = () => {
    const storedUsers = localStorage.getItem("users");
    let users = storedUsers ? JSON.parse(storedUsers) : [];
    
    // Check if admin user exists
    const adminExists = users.some((u: StoredUser) => u.username === "admin");
    
    if (!adminExists) {
      // Add admin user
      users.push({
        username: "admin",
        password: "admin123",
        name: "Administrator"
      });
      localStorage.setItem("users", JSON.stringify(users));
      console.log("Admin user initialized");
    }
  };

  // Signup function for new voters
  const signup = async (username: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // This would be replaced with actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API delay
      
      // Check if user already exists (mock check)
      const existingUsers = localStorage.getItem("users");
      let users = existingUsers ? JSON.parse(existingUsers) : [];
      
      const userExists = users.some((u: StoredUser) => u.username === username);
      if (userExists) {
        toast.error("Username already exists. Please choose another.");
        return false;
      }
      
      // Add new user to storage
      const newUser: StoredUser = {
        username,
        password,
        name,
        aadhaarVerified: false,
        hasVoted: false
      };
      
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      
      toast.success("Account created successfully. Please login.");
      return true;
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      // Check user credentials against stored users
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const foundUser = users.find((u: StoredUser) => u.username === username && u.password === password);
        
        if (foundUser) {
          const mockUser: User = {
            id: `voter-${Date.now()}`,
            name: foundUser.name || username,
            username: foundUser.username,
            role: "voter",
            isAuthenticated: true,
            aadhaarVerified: foundUser.aadhaarVerified || false,
            aadhaarNumber: foundUser.aadhaarNumber || undefined,
            walletAddress: foundUser.walletAddress || undefined,
            hasVoted: foundUser.hasVoted || false
          };
          
          setUser(mockUser);
          localStorage.setItem("user", JSON.stringify(mockUser));
          toast.success("Logged in successfully");
          return true;
        }
      }
      
      toast.error("Invalid credentials");
      return false;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000)); 
      
      // Check stored users for admin
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const adminUser = users.find((u: StoredUser) => u.username === "admin" && u.password === "admin123");
        
        if ((username === "admin" && password === "admin123") || adminUser) {
          const adminUserObj: User = {
            id: "admin-1",
            name: "Administrator",
            username: "admin",
            role: "admin",
            isAuthenticated: true,
          };
          
          setUser(adminUserObj);
          localStorage.setItem("user", JSON.stringify(adminUserObj));
          toast.success("Admin logged in successfully");
          return true;
        }
      }
      
      toast.error("Invalid admin credentials");
      return false;
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

  // Update user vote status
  const updateUserVoteStatus = (hasVoted: boolean) => {
    if (user) {
      // Update the current user
      const updatedUser = { ...user, hasVoted };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      // Update in stored users
      const storedUsers = localStorage.getItem("users");
      if (storedUsers && user.username) {
        const users = JSON.parse(storedUsers);
        const updatedUsers = users.map((u: StoredUser) => {
          if (u.username === user.username) {
            return {
              ...u,
              hasVoted
            };
          }
          return u;
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
      }
    }
  };

  // Aadhaar verification with number storage
  const verifyAadhaar = async (aadhaarData: FormData): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API delay for verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const aadhaarNumber = aadhaarData.get("aadhaarNumber") as string;
      
      // Check if this Aadhaar is already linked to another account
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const aadhaarExists = users.some((u: StoredUser) => 
          u.aadhaarNumber === aadhaarNumber && 
          u.username !== user?.username
        );
        
        if (aadhaarExists) {
          toast.error("This Aadhaar number is already registered with another account.");
          return false;
        }
      }
      
      if (user && user.username) {
        // Update the user in the current session
        const updatedUser = { 
          ...user, 
          aadhaarVerified: true,
          aadhaarNumber: aadhaarNumber
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Update in the stored users
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((u: StoredUser) => {
            if (u.username === user.username) {
              return {
                ...u,
                aadhaarVerified: true,
                aadhaarNumber: aadhaarNumber
              };
            }
            return u;
          });
          localStorage.setItem("users", JSON.stringify(updatedUsers));
        }
        
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
      
      // Check if this wallet is already linked to another account
      const storedUsers = localStorage.getItem("users");
      if (storedUsers) {
        const users = JSON.parse(storedUsers);
        const walletExists = users.some((u: StoredUser) => 
          u.walletAddress === walletAddress && 
          u.username !== user?.username
        );
        
        if (walletExists) {
          toast.error("This wallet address is already linked to another account.");
          return false;
        }
      }
      
      if (user && user.username) {
        const updatedUser = { 
          ...user, 
          walletAddress 
        };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        
        // Update in the stored users
        if (storedUsers) {
          const users = JSON.parse(storedUsers);
          const updatedUsers = users.map((u: StoredUser) => {
            if (u.username === user.username) {
              return {
                ...u,
                walletAddress
              };
            }
            return u;
          });
          localStorage.setItem("users", JSON.stringify(updatedUsers));
        }
        
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
    signup,
    adminLogin,
    logout,
    verifyAadhaar,
    connectWallet,
    updateUserVoteStatus
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
