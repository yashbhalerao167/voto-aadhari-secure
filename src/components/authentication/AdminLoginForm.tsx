
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, ShieldAlert } from "lucide-react";

export function AdminLoginForm() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await adminLogin(username, password);
      if (success) {
        navigate("/admin");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border-vote-primary">
      <CardHeader className="bg-vote-primary/10">
        <div className="flex justify-center mb-2">
          <ShieldAlert className="h-12 w-12 text-vote-primary" />
        </div>
        <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
        <CardDescription className="text-center">
          Secure access for election administrators only
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="admin-username">Admin Username</Label>
            <Input
              id="admin-username"
              type="text"
              placeholder="Enter admin username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="admin-password">Admin Password</Label>
            <Input
              id="admin-password"
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="text-xs text-gray-500 italic mt-4">
            For demo purposes: username = "admin", password = "admin123"
          </p>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full bg-vote-primary hover:bg-vote-secondary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-pulse-light">Authenticating...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <LogIn size={16} />
                Admin Login
              </span>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
