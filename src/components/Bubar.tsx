import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, ArrowRight, CheckCircle2, X } from 'lucide-react';
import { Asset } from '../lib/mockData';
import { formatCurrency } from '../lib/utils';

interface BubarProps {
  assets: Asset[];
  onComplete: (tx: any) => void;
}

export const Bubar: React.FC<BubarProps> = ({ assets, onComplete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'initial' | 'confirming' | 'processing' | 'success'>('initial');
  
  const totalValue = assets.reduce((acc, asset) => acc + (asset.balance * asset.priceInINR), 0);

  const handleBubar = () => {
    setStep('processing');
    // Simulate smart contract execution
    setTimeout(() => {
      setStep('success');
      onComplete({
        id: `bub-${Math.random().toString(36).substr(2, 9)}`,
        type: 'Bubar',
        asset: 'All Assets',
        amount: 1,
        valueInINR: totalValue,
        status: 'Confirmed',
        date: new Date().toLocaleString('en-IN'),
        txHash: '0x' + Math.random().toString(16).substr(2, 40),
        recipient: 'Primary Bank (Jaipur)'
      });
    }, 3000);
  };

  return (
    <>
      <button
        id="bubar-trigger"
        onClick={() => setIsOpen(true)}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-900/20"
      >
        <AlertTriangle size={20} />
        Bubar Portfolio
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => step !== 'processing' && setIsOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              {step === 'initial' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="bg-red-500/10 p-3 rounded-2xl">
                      <AlertTriangle className="text-red-500" size={32} />
                    </div>
                    <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white">
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Bubar Portfolio?</h2>
                    <p className="text-zinc-400">
                      This will liquidate all your current holdings into INR and transfer them to your linked bank account in <span className="text-white font-medium">Jaipur, Rajasthan</span>.
                    </p>
                  </div>

                  <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700">
                    <div className="text-sm text-zinc-500 mb-1">Total Liquidation Value</div>
                    <div className="text-3xl font-bold text-white tracking-tight">
                      {formatCurrency(totalValue)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setStep('confirming')}
                      className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-colors"
                    >
                      Proceed to Liquidation
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-full bg-transparent text-zinc-400 font-medium py-2 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {step === 'confirming' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white">Final Confirmation</h2>
                  <p className="text-zinc-400">
                    Are you absolutely sure? This action is recorded on the Ethereum blockchain and cannot be reversed.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Gas Fee: ₹450 (Estimated)
                    </div>
                    <div className="flex items-center gap-3 text-sm text-zinc-400">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Network: Ethereum Mainnet
                    </div>
                  </div>

                  <button
                    onClick={handleBubar}
                    className="w-full bg-red-600 text-white font-bold py-4 rounded-2xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Confirm & Bubar Now
                    <ArrowRight size={20} />
                  </button>
                </div>
              )}

              {step === 'processing' && (
                <div className="py-12 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-zinc-800 rounded-full" />
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 w-20 h-20 border-4 border-t-white border-transparent rounded-full"
                    />
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Processing Bubar</h3>
                    <p className="text-zinc-500 text-sm">Executing smart contracts and verifying on-chain ledger...</p>
                  </div>
                </div>
              )}

              {step === 'success' && (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="bg-green-500/10 p-4 rounded-full">
                      <CheckCircle2 className="text-green-500" size={48} />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Bubar Successful!</h2>
                    <p className="text-zinc-400">
                      Your portfolio has been dispersed. Funds are being transferred to your account.
                    </p>
                  </div>
                  <div className="bg-zinc-800/50 p-4 rounded-2xl text-left">
                    <div className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-2">Transaction Hash</div>
                    <div className="text-xs font-mono text-zinc-300 break-all">
                      0x{Math.random().toString(16).substr(2, 40)}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full bg-zinc-800 text-white font-bold py-4 rounded-2xl hover:bg-zinc-700 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
