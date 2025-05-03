
import { MainLayout } from "@/components/layout/MainLayout";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const About = () => {
  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About VotoAadhaar Secure</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            VotoAadhaar Secure represents the future of digital democracy, combining the security of Aadhaar authentication with the transparency and immutability of blockchain technology to create a trustworthy voting system.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Mission</h2>
          <p className="mb-6">
            We aim to revolutionize electoral systems by providing a secure, transparent, and accessible platform that ensures every eligible citizen can exercise their democratic right without concerns about fraud or manipulation.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Technology Stack</h2>
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h3 className="text-xl font-medium mb-4">Frontend</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>React.js with TypeScript for responsive user interfaces</li>
              <li>Tailwind CSS for modern, adaptive styling</li>
              <li>Ethers.js for blockchain interactions</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-4">Blockchain</h3>
            <ul className="list-disc pl-5 mb-4">
              <li>Ethereum blockchain for transparent, immutable vote recording</li>
              <li>Smart contracts written in Solidity</li>
              <li>MetaMask wallet integration for secure transactions</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-4">Authentication</h3>
            <ul className="list-disc pl-5">
              <li>Aadhaar-based verification system</li>
              <li>Multi-factor authentication processes</li>
              <li>Encrypted data storage and transmission</li>
            </ul>
          </div>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Security Measures</h2>
          <p className="mb-4">
            Our platform incorporates multiple layers of security to ensure the integrity of the voting process:
          </p>
          <ul className="list-disc pl-5 mb-6">
            <li>Biometric verification through Aadhaar</li>
            <li>Blockchain's immutable ledger for vote recording</li>
            <li>End-to-end encryption for all data transmission</li>
            <li>Decentralized vote counting mechanism</li>
            <li>Audit trails and vote verification capabilities</li>
          </ul>
        </div>
        
        <h2 className="text-2xl font-semibold mt-10 mb-6">Frequently Asked Questions</h2>
        
        <Accordion type="single" collapsible className="w-full mb-10">
          <AccordionItem value="item-1">
            <AccordionTrigger>How does blockchain ensure vote security?</AccordionTrigger>
            <AccordionContent>
              Blockchain technology creates an immutable, transparent record of all votes that cannot be altered once cast. Each vote is secured using cryptographic techniques and distributed across multiple nodes, making tampering virtually impossible.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Is my Aadhaar information safe?</AccordionTrigger>
            <AccordionContent>
              Yes, we prioritize the security of your personal information. Aadhaar verification is done through secure channels, and we only store the minimum necessary information. All personal data is encrypted and protected according to the highest industry standards.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger>Do I need technical knowledge to use the platform?</AccordionTrigger>
            <AccordionContent>
              No, our platform is designed to be user-friendly regardless of technical expertise. The interface guides you through each step of the process, from authentication to vote casting. For blockchain interactions, we've simplified the process while maintaining security.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger>Can I verify that my vote was counted correctly?</AccordionTrigger>
            <AccordionContent>
              Absolutely. Once your vote is cast, you receive a unique transaction hash that you can use to verify your vote on the blockchain. This allows for personal verification without compromising vote secrecy.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5">
            <AccordionTrigger>What if I don't have a MetaMask wallet?</AccordionTrigger>
            <AccordionContent>
              MetaMask is required to interact with the Ethereum blockchain. However, we provide detailed instructions on how to set up a MetaMask wallet, which is a simple and free process. No cryptocurrency is needed to vote on our platform.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="bg-vote-primary/10 p-6 rounded-lg border border-vote-primary/20 mb-10">
          <h3 className="text-xl font-semibold mb-3 text-vote-primary">Disclaimer</h3>
          <p className="text-sm">
            This application is a demonstration project showcasing the potential of blockchain technology and Aadhaar verification in electoral systems. It is not intended for use in actual governmental elections without additional regulatory compliance and security audits.
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default About;
