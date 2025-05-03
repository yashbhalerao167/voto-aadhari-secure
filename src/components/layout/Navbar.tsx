
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, Menu, X, Vote } from "lucide-react";

export function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Vote className="h-8 w-8 text-vote-primary" />
            <span className="text-xl font-bold text-vote-primary">VotoAadhaar</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-vote-primary transition-colors">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-vote-primary transition-colors">
              About
            </Link>
            {user ? (
              <>
                {user.role === "admin" ? (
                  <Link to="/admin" className="text-gray-600 hover:text-vote-primary transition-colors">
                    Dashboard
                  </Link>
                ) : (
                  <Link to="/vote" className="text-gray-600 hover:text-vote-primary transition-colors">
                    Vote
                  </Link>
                )}
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="flex items-center space-x-1">
                    <LogIn size={16} />
                    <span>Login</span>
                  </Button>
                </Link>
                <Link to="/admin-login">
                  <Button variant="default">Admin</Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-vote-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="text-gray-600 hover:text-vote-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              {user ? (
                <>
                  {user.role === "admin" ? (
                    <Link 
                      to="/admin" 
                      className="text-gray-600 hover:text-vote-primary transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <Link 
                      to="/vote" 
                      className="text-gray-600 hover:text-vote-primary transition-colors py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Vote
                    </Link>
                  )}
                  <Button variant="outline" onClick={() => { logout(); setIsMenuOpen(false); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full flex items-center justify-center space-x-1">
                      <LogIn size={16} />
                      <span>Login</span>
                    </Button>
                  </Link>
                  <Link to="/admin-login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="default" className="w-full">Admin</Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
