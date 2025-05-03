
import { Button } from "@/components/ui/button";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 py-20 rounded-xl mb-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-vote-primary mb-4">
                Secure Voting with Blockchain & Aadhaar
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Experience the future of democratic participation with our decentralized voting system using Ethereum blockchain and Aadhaar verification.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/login">
                  <Button size="lg">Get Started</Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg">Learn More</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/placeholder.svg"
                alt="Blockchain Voting"
                className="max-w-full h-auto rounded-lg shadow-lg"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-t-4 border-vote-primary">
              <div className="w-12 h-12 bg-vote-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-vote-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Aadhaar Authentication</h3>
              <p className="text-gray-600">
                Secure login using Aadhaar card verification ensures only eligible voters can participate in the electoral process.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-t-4 border-vote-accent">
              <div className="w-12 h-12 bg-vote-accent/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-vote-accent text-2xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Blockchain Security</h3>
              <p className="text-gray-600">
                All votes are recorded on the Ethereum blockchain, making the process transparent, immutable, and resistant to tampering.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow border-t-4 border-vote-secondary">
              <div className="w-12 h-12 bg-vote-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-vote-secondary text-2xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">
                Comprehensive dashboards provide real-time insights into voting patterns, turnout statistics, and election results.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-gray-50 rounded-xl">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-vote-primary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold mb-2">Authenticate with Aadhaar</h3>
              <p className="text-gray-600">
                Upload your Aadhaar card for identity verification
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-vote-secondary rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Wallet</h3>
              <p className="text-gray-600">
                Link your MetaMask wallet to enable blockchain transactions
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-vote-accent rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2">Cast Your Vote</h3>
              <p className="text-gray-600">
                Select your preferred candidate and submit your vote
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-vote-success rounded-full flex items-center justify-center text-white text-xl font-bold mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold mb-2">Verify On Blockchain</h3>
              <p className="text-gray-600">
                Your vote is securely recorded on the Ethereum blockchain
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Participate?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our secure, transparent voting platform and make your voice heard. The future of democracy is decentralized.
          </p>
          <Link to="/login">
            <Button size="lg">Start Voting Now</Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
