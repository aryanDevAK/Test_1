import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, ShieldCheck, UserPlus, Fingerprint } from 'lucide-react';
import { MOCK_USERS } from '../services/mockApi';

interface AuthProps {
  onLogin: (user: any) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email === email);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid credentials. Try aarav.sharma@gmail.com');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-2xl shadow-white/10">
            <ShieldCheck className="text-black" size={32} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Kosh</h1>
          <p className="text-zinc-500">Decentralized Portfolio Management</p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl">
          {view === 'login' && (
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                <p className="text-sm text-zinc-500">Enter your credentials to access your ledger.</p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-xl">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-white transition-all"
                    required
                  />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-white transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-zinc-500 cursor-pointer">
                  <input type="checkbox" className="accent-white" />
                  Remember me
                </label>
                <button 
                  type="button"
                  onClick={() => setView('forgot')}
                  className="text-white font-bold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
              >
                {isLoading ? 'Verifying...' : 'Sign In'}
                {!isLoading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>

              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setView('register')}
                  className="text-sm text-zinc-500 hover:text-white transition-colors"
                >
                  Don't have an account? <span className="text-white font-bold">Create one</span>
                </button>
              </div>
            </form>
          )}

          {view === 'register' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Create Account</h2>
                <p className="text-sm text-zinc-500">Join the decentralized finance revolution.</p>
              </div>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-4 text-white outline-none focus:border-white transition-all"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-4 text-white outline-none focus:border-white transition-all"
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-4 text-white outline-none focus:border-white transition-all"
                />
              </div>

              <button className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                <UserPlus size={18} />
                Register Account
              </button>

              <button 
                onClick={() => setView('login')}
                className="w-full text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Already have an account? <span className="text-white font-bold">Sign In</span>
              </button>
            </div>
          )}

          {view === 'forgot' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                <p className="text-sm text-zinc-500">We'll send a recovery link to your email.</p>
              </div>
              
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-4 text-white outline-none focus:border-white transition-all"
              />

              <button className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2">
                <Fingerprint size={18} />
                Send Recovery Link
              </button>

              <button 
                onClick={() => setView('login')}
                className="w-full text-sm text-zinc-500 hover:text-white transition-colors"
              >
                Back to <span className="text-white font-bold">Sign In</span>
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-zinc-600">
          Securely powered by Firebase Authentication & Hybrid Ledger Protocol
        </div>
      </motion.div>
    </div>
  );
};
