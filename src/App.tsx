import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Wallet, 
  TrendingUp, 
  History, 
  PieChart as PieChartIcon, 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownRight,
  Search,
  Bell,
  User,
  ShieldCheck,
  ExternalLink,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { Asset, Transaction, MOCK_TRANSACTIONS, ETH_7D_HISTORY, MARKET_FEED_INITIAL } from './lib/mockData';
import { formatCurrency, cn } from './lib/utils';
import { Bubar } from './components/Bubar';
import { WalletModal } from './components/WalletModal';
import { Auth } from './components/Auth';
import { EXTENDED_MOCK_ASSETS, UserProfile } from './services/mockApi';

const CHART_DATA = [
  { name: 'Jan', value: 450000 },
  { name: 'Feb', value: 520000 },
  { name: 'Mar', value: 480000 },
  { name: 'Apr', value: 610000 },
  { name: 'May', value: 750000 },
  { name: 'Jun', value: 854300 },
];

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('kosh_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'portfolio' | 'history' | 'analytics' | 'settings'>('dashboard');
  const [assets, setAssets] = useState<Asset[]>(EXTENDED_MOCK_ASSETS);
  const [marketFeed, setMarketFeed] = useState(MARKET_FEED_INITIAL);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulated Price Feed / Data Synchronizer
  React.useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setIsSyncing(true);
      
      setAssets(prevAssets => prevAssets.map(asset => {
        const fluctuation = 1 + (Math.random() * 0.04 - 0.02);
        return {
          ...asset,
          priceInINR: Math.round(asset.priceInINR * fluctuation),
          change24h: Number((asset.change24h + (Math.random() * 0.2 - 0.1)).toFixed(2))
        };
      }));

      setTimeout(() => {
        setLastSynced(new Date());
        setIsSyncing(false);
      }, 800);
    }, 10000);

    return () => clearInterval(interval);
  }, [user]);

  // Market Feed Polling (5 seconds)
  React.useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      setMarketFeed(prevFeed => prevFeed.map(item => {
        const fluctuation = 1 + (Math.random() * 0.02 - 0.01);
        return {
          ...item,
          price: Math.round(item.price * fluctuation),
          change24h: Number((item.change24h + (Math.random() * 0.1 - 0.05)).toFixed(2))
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [user]);

  const totalBalance = useMemo(() => 
    assets.reduce((acc, asset) => acc + (asset.balance * asset.priceInINR), 0)
  , [assets]);

  const pieData = useMemo(() => 
    assets.map(asset => ({
      name: asset.symbol,
      value: asset.balance * asset.priceInINR
    }))
  , [assets]);

  const topAsset = useMemo(() => {
    return [...assets].sort((a, b) => (b.balance * b.priceInINR) - (a.balance * a.priceInINR))[0];
  }, [assets]);

  const riskScore = useMemo(() => {
    const volatileValue = assets
      .filter(a => a.symbol !== 'USDT')
      .reduce((acc, a) => acc + (a.balance * a.priceInINR), 0);
    const ratio = volatileValue / totalBalance;
    if (ratio > 0.8) return { label: 'High', color: 'text-red-500' };
    if (ratio > 0.5) return { label: 'Medium', color: 'text-orange-500' };
    return { label: 'Low', color: 'text-green-500' };
  }, [assets, totalBalance]);

  const handleLogin = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem('kosh_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kosh_user');
  };

  const handleBubarComplete = (newTx: Transaction) => {
    setTransactions([newTx, ...transactions]);
  };

  const handleConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-zinc-700">
      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
        onConnect={handleConnect} 
      />
      
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 md:w-64 bg-zinc-950 border-r border-zinc-900 z-40 hidden sm:flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <ShieldCheck className="text-black" size={24} />
          </div>
          <span className="font-bold text-xl hidden md:block tracking-tight">Kosh</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'portfolio', icon: PieChartIcon, label: 'Portfolio' },
            { id: 'history', icon: History, label: 'Ledger' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={cn(
                "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all",
                activeTab === item.id 
                  ? "bg-zinc-900 text-white shadow-inner" 
                  : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
              )}
            >
              <item.icon size={22} />
              <span className="font-medium hidden md:block">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={22} />
            <span className="font-medium hidden md:block">Logout</span>
          </button>

          <div className="bg-zinc-900 rounded-2xl p-4 hidden md:block border border-zinc-800">
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-2">Network Status</p>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>Ethereum Mainnet</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="sm:pl-20 md:pl-64 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 bg-black/50 backdrop-blur-xl border-b border-zinc-900 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 px-4 py-2 rounded-full w-full max-w-md">
            <Search size={18} className="text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search transactions, assets..." 
              className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-600"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-zinc-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-black" />
            </button>
            
            <button 
              onClick={() => walletAddress ? handleDisconnect() : setIsWalletModalOpen(true)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all",
                walletAddress 
                  ? "bg-zinc-900 text-green-400 border border-green-900/30 hover:bg-zinc-800" 
                  : "bg-white text-black hover:bg-zinc-200"
              )}
            >
              <Wallet size={18} />
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Connect Wallet"}
            </button>
            
            <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Hero Section */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Namaste, {user.name.split(' ')[0]}</h1>
                    <p className="text-zinc-500 text-lg">Your decentralized portfolio is performing well today.</p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Total Net Worth</p>
                    <p className="text-6xl font-bold tracking-tighter">{formatCurrency(totalBalance)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 text-right">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
                    <div className={cn("w-1.5 h-1.5 rounded-full", isSyncing ? "bg-blue-500 animate-pulse" : "bg-green-500")} />
                    Synced: {lastSynced.toLocaleTimeString('en-IN', { hour12: false })}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] space-y-4 hover:border-zinc-700 transition-all group">
                  <div className="text-zinc-500 font-medium">Total Portfolio Value</div>
                  <div className="text-4xl font-bold tracking-tighter">{formatCurrency(totalBalance)}</div>
                  <div className="text-sm text-zinc-500">Net worth across all wallets</div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] space-y-4 hover:border-zinc-700 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="text-zinc-500 font-medium">24h Change</div>
                    <div className={cn(
                      "px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1",
                      "bg-green-500/10 text-green-500"
                    )}>
                      <TrendingUp size={12} />
                      +3.4%
                    </div>
                  </div>
                  <div className="text-4xl font-bold tracking-tighter">+{formatCurrency(totalBalance * 0.034)}</div>
                  <div className="text-sm text-zinc-500">Daily portfolio performance</div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] space-y-4 hover:border-zinc-700 transition-all group">
                  <div className="text-zinc-500 font-medium">Top Asset</div>
                  <div className="text-4xl font-bold tracking-tighter">{topAsset?.symbol}</div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <img src={topAsset?.icon} className="w-4 h-4 rounded-full" alt="" referrerPolicy="no-referrer" />
                    <span>Dominating {((topAsset?.balance * topAsset?.priceInINR / totalBalance) * 100).toFixed(1)}% of portfolio</span>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] space-y-4 hover:border-zinc-700 transition-all group">
                  <div className="text-zinc-500 font-medium">Risk Indicator</div>
                  <div className={cn("text-4xl font-bold tracking-tighter", riskScore.color)}>{riskScore.label}</div>
                  <div className="text-sm text-zinc-500">Based on asset volatility</div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem]">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-xl font-bold">ETH Price Trend (7D)</h3>
                      <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Live from Mock API</div>
                    </div>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={ETH_7D_HISTORY}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                          <XAxis dataKey="day" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                          <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                          />
                          <Line type="monotone" dataKey="price" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6' }} activeDot={{ r: 6 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem] flex flex-col items-center justify-center">
                      <h3 className="text-xl font-bold mb-8 w-full text-left">Asset Allocation</h3>
                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4 w-full mt-4">
                        {assets.map((asset, i) => (
                          <div key={asset.id} className="flex items-center gap-2 text-xs">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="text-zinc-400">{asset.symbol}</span>
                            <span className="text-zinc-600 font-bold ml-auto">{((asset.balance * asset.priceInINR / totalBalance) * 100).toFixed(1)}%</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2rem]">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Market Feed</h3>
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          Polling
                        </div>
                      </div>
                      <div className="space-y-4">
                        {marketFeed.map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-2xl border border-zinc-700/50">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-xs">
                                {item.symbol[0]}
                              </div>
                              <div>
                                <p className="font-bold text-sm">{item.symbol}</p>
                                <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">{item.name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm">{formatCurrency(item.price)}</p>
                              <p className={cn(
                                "text-[10px] font-bold",
                                item.change24h >= 0 ? "text-green-500" : "text-red-500"
                              )}>
                                {item.change24h >= 0 ? '+' : ''}{item.change24h}%
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <Bubar assets={assets} onComplete={handleBubarComplete} />

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-2">
                      <h3 className="text-xl font-bold">Top Assets</h3>
                      <button onClick={() => setActiveTab('portfolio')} className="text-zinc-500 hover:text-zinc-300 text-sm font-medium flex items-center gap-1">
                        View All <ArrowUpRight size={16} />
                      </button>
                    </div>
                    <div className="space-y-4">
                      {assets.slice(0, 5).map((asset) => (
                        <div key={asset.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-3xl flex items-center justify-between hover:border-zinc-700 transition-all group">
                          <div className="flex items-center gap-4">
                            <img src={asset.icon} className="w-10 h-10 rounded-full" alt={asset.name} referrerPolicy="no-referrer" />
                            <div>
                              <p className="font-bold text-sm">{asset.name}</p>
                              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{asset.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">{formatCurrency(asset.balance * asset.priceInINR)}</p>
                            <p className={cn(
                              "text-[10px] font-bold",
                              asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                            )}>
                              {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'portfolio' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h1 className="text-4xl font-bold tracking-tight mb-2">Portfolio</h1>
                  <p className="text-zinc-500">Comprehensive view of your digital assets and their performance.</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search assets..." 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:border-zinc-700 transition-all"
                    />
                  </div>
                  <button className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:bg-zinc-200 transition-all flex items-center gap-2 whitespace-nowrap">
                    <ArrowUpRight size={20} /> Add Asset
                  </button>
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-zinc-500 text-xs uppercase tracking-widest border-b border-zinc-800">
                        <th className="px-8 py-6 font-bold">Asset</th>
                        <th className="px-8 py-6 font-bold">Quantity</th>
                        <th className="px-8 py-6 font-bold">Price</th>
                        <th className="px-8 py-6 font-bold">Value (INR)</th>
                        <th className="px-8 py-6 font-bold text-right">Change %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-zinc-800/20 transition-colors group">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <img src={asset.icon} className="w-10 h-10 rounded-full" alt={asset.name} referrerPolicy="no-referrer" />
                              <div>
                                <p className="font-bold">{asset.name}</p>
                                <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{asset.symbol}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-6 font-medium">{asset.balance} {asset.symbol}</td>
                          <td className="px-8 py-6 font-medium">{formatCurrency(asset.priceInINR)}</td>
                          <td className="px-8 py-6 font-bold">{formatCurrency(asset.balance * asset.priceInINR)}</td>
                          <td className={cn(
                            "px-8 py-6 font-bold text-right",
                            asset.change24h >= 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <h2 className="text-3xl font-bold">Transparent Ledger</h2>
                <div className="flex flex-wrap gap-4 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search ledger..." 
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-2.5 pl-10 pr-4 text-sm outline-none focus:border-zinc-700 transition-all"
                    />
                  </div>
                  <div className="flex gap-2">
                    {['All', 'Deposit', 'Withdrawal', 'Bubar'].map((type) => (
                      <button 
                        key={type}
                        className={cn(
                          "px-4 py-2 rounded-full text-xs font-bold border transition-all",
                          type === 'All' ? "bg-white text-black border-white" : "bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-zinc-700"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                  <button className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm bg-zinc-900 border border-zinc-800 px-4 py-2.5 rounded-full">
                    <ExternalLink size={16} />
                    Export CSV
                  </button>
                </div>
              </div>
              
              <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-zinc-500 text-xs uppercase tracking-widest border-b border-zinc-800">
                        <th className="px-8 py-6 font-bold">Type</th>
                        <th className="px-8 py-6 font-bold">Asset</th>
                        <th className="px-8 py-6 font-bold">Amount</th>
                        <th className="px-8 py-6 font-bold">Value (INR)</th>
                        <th className="px-8 py-6 font-bold">Status</th>
                        <th className="px-8 py-6 font-bold text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/50">
                      {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-zinc-800/20 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "p-2 rounded-lg",
                                tx.type === 'Deposit' ? "bg-green-500/10 text-green-500" :
                                tx.type === 'Withdrawal' ? "bg-red-500/10 text-red-500" :
                                tx.type === 'Bubar' ? "bg-orange-500/10 text-orange-500" :
                                "bg-blue-500/10 text-blue-500"
                              )}>
                                {tx.type === 'Deposit' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                              </div>
                              <span className="font-bold">{tx.type}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 font-medium">{tx.asset}</td>
                          <td className="px-8 py-6 font-mono">{tx.amount}</td>
                          <td className="px-8 py-6 font-bold">{formatCurrency(tx.valueInINR)}</td>
                          <td className="px-8 py-6">
                            <span className="px-2 py-1 rounded-md bg-zinc-800 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border border-zinc-700">
                              {tx.status}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-zinc-500 text-sm text-right font-medium">{tx.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Advanced Analytics</h1>
                <p className="text-zinc-500">Deep dive into your portfolio performance and market trends.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Total Profit</p>
                  <p className="text-2xl font-bold text-green-500">+{formatCurrency(totalBalance * 0.15)}</p>
                  <p className="text-xs text-zinc-600 mt-1">All-time performance</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Best Asset</p>
                  <p className="text-2xl font-bold">Ethereum (ETH)</p>
                  <p className="text-xs text-green-500 mt-1">+42.8% this month</p>
                </div>
                <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl">
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Portfolio Health</p>
                  <p className="text-2xl font-bold">Excellent</p>
                  <p className="text-xs text-blue-500 mt-1">Diversification score: 88/100</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
                  <h3 className="text-xl font-bold mb-6">Profit/Loss Analysis</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
                        <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px' }}
                        />
                        <Area type="monotone" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
                  <h3 className="text-xl font-bold mb-6">Risk Assessment</h3>
                  <div className="space-y-6">
                    <div className="p-6 bg-zinc-800/50 rounded-2xl border border-zinc-700">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-zinc-400 font-medium">Volatility Index</span>
                        <span className="text-orange-500 font-bold">Medium Risk</span>
                      </div>
                      <div className="w-full bg-zinc-700 h-2 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full w-[65%]" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Sharpe Ratio</p>
                        <p className="text-xl font-bold">1.84</p>
                      </div>
                      <div className="p-4 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Max Drawdown</p>
                        <p className="text-xl font-bold text-red-500">-14.2%</p>
                      </div>
                    </div>
                    <div className="p-6 bg-zinc-800/20 rounded-2xl border border-dashed border-zinc-700">
                      <p className="text-sm text-zinc-400 leading-relaxed">
                        Your portfolio risk is currently balanced. Increasing allocation to stablecoins could lower volatility, while adding more altcoins would increase potential returns and risk.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10 max-w-4xl"
            >
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Settings</h1>
                <p className="text-zinc-500">Manage your account preferences and security settings.</p>
              </div>

              <div className="space-y-6">
                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
                  <h3 className="text-xl font-bold mb-6">Profile Information</h3>
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-zinc-200 transition-all">
                        Change Avatar
                      </button>
                      <p className="text-zinc-500 text-xs mt-2">JPG, GIF or PNG. Max size of 800K</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Full Name</label>
                      <input type="text" defaultValue={user.name} className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</label>
                      <input type="email" defaultValue={user.email} className="w-full bg-zinc-800 border-zinc-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
                  <h3 className="text-xl font-bold mb-6">Security & Privacy</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                      <div>
                        <p className="font-bold">Two-Factor Authentication</p>
                        <p className="text-zinc-500 text-sm">Add an extra layer of security to your account.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Status: Off</span>
                        <button className="text-purple-500 font-bold hover:underline">Enable</button>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                      <div>
                        <p className="font-bold">Hardware Key Support</p>
                        <p className="text-zinc-500 text-sm">Use a physical key like YubiKey for authentication.</p>
                      </div>
                      <button className="text-purple-500 font-bold hover:underline">Manage</button>
                    </div>
                    <div className="flex justify-between items-center p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                      <div>
                        <p className="font-bold">Privacy Mode</p>
                        <p className="text-zinc-500 text-sm">Hide balances from the main dashboard view.</p>
                      </div>
                      <div className="w-12 h-6 bg-zinc-700 rounded-full relative cursor-pointer">
                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8">
                  <h3 className="text-xl font-bold mb-6">Connected Wallets</h3>
                  <div className="space-y-4">
                    {walletAddress ? (
                      <div className="flex justify-between items-center p-6 bg-zinc-800/30 rounded-2xl border border-zinc-700">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center">
                            <Wallet className="text-orange-500" size={20} />
                          </div>
                          <div>
                            <p className="font-bold">MetaMask</p>
                            <p className="text-zinc-500 text-xs font-mono">{walletAddress}</p>
                          </div>
                        </div>
                        <button onClick={handleDisconnect} className="text-red-500 font-bold hover:underline">Disconnect</button>
                      </div>
                    ) : (
                      <div className="p-8 border-2 border-dashed border-zinc-800 rounded-3xl text-center">
                        <p className="text-zinc-500 mb-4">No wallets connected</p>
                        <button 
                          onClick={() => setIsWalletModalOpen(true)}
                          className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-zinc-200 transition-all"
                        >
                          Connect Wallet
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 w-full bg-zinc-950 border-t border-zinc-900 p-4 flex justify-around sm:hidden z-50">
        <button onClick={() => setActiveTab('dashboard')} className={cn("p-2", activeTab === 'dashboard' ? "text-white" : "text-zinc-600")}>
          <LayoutDashboard size={24} />
        </button>
        <button onClick={() => setActiveTab('portfolio')} className={cn("p-2", activeTab === 'portfolio' ? "text-white" : "text-zinc-600")}>
          <PieChartIcon size={24} />
        </button>
        <button onClick={() => setActiveTab('history')} className={cn("p-2", activeTab === 'history' ? "text-white" : "text-zinc-600")}>
          <History size={24} />
        </button>
      </nav>
    </div>
  );
}
