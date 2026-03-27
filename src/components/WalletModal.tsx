import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Wallet, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { MOCK_WALLET_ADDRESSES } from '../services/mockApi';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (address: string) => void;
}

const WALLET_PROVIDERS = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Mirror_Logo.svg',
    description: 'Connect to your MetaMask Wallet'
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg',
    description: 'Scan with Rainbow, Trust, Argent and more'
  }
];

export const WalletModal: React.FC<WalletModalProps> = ({ isOpen, onClose, onConnect }) => {
  const [connectingId, setConnectingId] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnectingId(id);
    // Simulate connection delay
    setTimeout(() => {
      const address = MOCK_WALLET_ADDRESSES[Math.floor(Math.random() * MOCK_WALLET_ADDRESSES.length)];
      onConnect(address);
      setConnectingId(null);
      onClose();
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Wallet className="text-black" size={20} />
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Connect Wallet</h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              {WALLET_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  disabled={!!connectingId}
                  onClick={() => handleConnect(provider.id)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all group",
                    connectingId === provider.id 
                      ? "bg-white border-white text-black" 
                      : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl p-2 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <img src={provider.icon} alt={provider.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold">{provider.name}</div>
                      <div className="text-xs text-zinc-500">{provider.description}</div>
                    </div>
                  </div>
                  {connectingId === provider.id ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" size={20} />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-900">
              <div className="flex items-start gap-3 text-zinc-500">
                <ShieldCheck size={18} className="mt-0.5 text-green-500 shrink-0" />
                <p className="text-xs leading-relaxed">
                  By connecting your wallet, you agree to our Terms of Service and Privacy Policy. Kosh is a non-custodial platform.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
