
import { Link } from "react-router-dom";
import { Vote } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2">
              <Vote className="h-6 w-6 text-vote-primary" />
              <span className="text-lg font-bold text-vote-primary">VotoAadhaar</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Secure, transparent voting powered by blockchain technology and Aadhaar verification.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-600 hover:text-vote-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-vote-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/vote" className="text-gray-600 hover:text-vote-primary transition-colors">
                  Vote
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-vote-primary transition-colors">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-800 mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-vote-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-vote-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-6 text-sm text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} VotoAadhaar. All rights reserved.</p>
          <p className="mt-1">This is a demonstration project. Not for actual electoral use.</p>
        </div>
      </div>
    </footer>
  );
}
