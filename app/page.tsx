"use client"
import { useState } from "react";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import { Wallet, HDNodeWallet } from "ethers";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, PlusCircle } from "lucide-react";

export default function Home() {
  const [mneumonics, setMneumonics] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [addresses, setAddresses] = useState<string[]>([]);

  const generateNewMneumonics = async () => {
    const newMneumonics = generateMnemonic();
    const newMneumonicsArray = newMneumonics.split(' ');
    setMneumonics(newMneumonicsArray);
    setAddresses([]);
    setCurrentIndex(0);
  };

  const copyMneumonicsToClipboard = () => {
    navigator.clipboard.writeText(mneumonics.join(' '));
  };

  const generateNewAddress = async () => {
    try {
      const seed = await mnemonicToSeed(mneumonics.join(' '));
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const privateKey = child.privateKey;
      const wallet = new Wallet(privateKey);

      setCurrentIndex(currentIndex + 1);
      setAddresses([...addresses, wallet.address]);
    } catch (error: any) {
      console.log(error);
    }
  };

  const copyAddressToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800 flex flex-col items-center justify-center p-4 overflow-x-hidden">
      <div className="w-full max-w-4xl space-y-8 px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mt-10 text-white mb-4">
            Web3 Wallet Generator
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl">
            Generate secure mnemonic phrases and Ethereum addresses
          </p>
        </div>

        <div className="flex justify-center space-x-4">
          <Button 
            onClick={generateNewMneumonics}
            disabled={mneumonics.length > 0}
            className="bg-white/10 text-white hover:bg-white/20 transition-all duration-300 rounded-full flex items-center space-x-2 px-6 py-3"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Generate</span>
          </Button>

          {mneumonics.length > 0 && (
            <Button 
              onClick={copyMneumonicsToClipboard}
              className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all duration-300 rounded-full flex items-center space-x-2 px-6 py-3"
            >
              <Copy className="w-5 h-5" />
              <span>Copy</span>
            </Button>
          )}
        </div>

        {mneumonics.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mneumonics.map((word, index) => (
              <div 
                key={word}
                className="transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="bg-white/10 border border-white/20 text-white text-center py-3 rounded-xl font-semibold">
                  {index + 1}. {word}
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex justify-center space-x-4">
          <Button 
            onClick={generateNewAddress}
            disabled={!mneumonics.length}
            className="bg-white/10 text-white hover:bg-white/20 transition-all duration-300 rounded-full flex items-center space-x-2 px-6 py-3 disabled:opacity-50"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Generate Ethereum Address</span>
          </Button>
        </div>

        {addresses.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 max-h-[300px] overflow-y-auto">
            <h2 className="text-xl text-white font-semibold text-center">
              Generated Ethereum Addresses
            </h2>
            {addresses.map((address, index) => (
              <div 
                key={address} 
                className="flex justify-between items-center bg-white/10 border border-white/20 rounded-xl p-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
              >
                <div className="text-white">
                  <span className="text-zinc-400 mr-2">#{index + 1}</span>
                  {address}
                </div>
                <Button 
                  onClick={() => copyAddressToClipboard(address)}
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}