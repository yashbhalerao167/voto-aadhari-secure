
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function AadhaarVerification() {
  const { verifyAadhaar } = useAuth();
  const navigate = useNavigate();
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    try {
      // Validate Aadhaar number (simple validation for demo)
      if (aadhaarNumber.length !== 12 || !/^\d+$/.test(aadhaarNumber)) {
        toast.error("Please enter a valid 12-digit Aadhaar number");
        return;
      }
      
      // Check if file is uploaded
      if (!fileInputRef.current?.files || fileInputRef.current.files.length === 0) {
        toast.error("Please upload your Aadhaar card image");
        return;
      }
      
      // Create form data for upload
      const formData = new FormData();
      formData.append("aadhaarNumber", aadhaarNumber);
      formData.append("aadhaarImage", fileInputRef.current.files[0]);
      
      const success = await verifyAadhaar(formData);
      if (success) {
        toast.success("Aadhaar verification successful");
        navigate("/wallet-connect");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Aadhaar Verification</CardTitle>
        <CardDescription className="text-center">
          Please verify your identity using your Aadhaar card
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="aadhaar-number">Aadhaar Number</Label>
            <Input
              id="aadhaar-number"
              type="text"
              placeholder="Enter your 12-digit Aadhaar number"
              value={aadhaarNumber}
              onChange={(e) => setAadhaarNumber(e.target.value)}
              required
              maxLength={12}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Upload Aadhaar Card Image</Label>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handleFileChange}
              required
            />
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={triggerFileUpload}
                disabled={isUploading}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Choose File"}
              </Button>
              {uploadedFileName && (
                <span className="text-sm text-green-600 flex-1 truncate">
                  {uploadedFileName}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              Please upload a clear image of your Aadhaar card. Supported formats: JPG, PNG
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This is a demo application. No actual Aadhaar verification will be performed, and your data is not stored or shared.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isVerifying}
          >
            {isVerifying ? (
              <span className="animate-pulse-light">Verifying...</span>
            ) : (
              "Verify Aadhaar"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
