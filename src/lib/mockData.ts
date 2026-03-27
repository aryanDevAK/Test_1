import { format } from 'date-fns';

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  balance: number;
  priceInINR: number;
  change24h: number;
  icon: string;
}

export interface Transaction {
  id: string;
  type: 'Deposit' | 'Withdrawal' | 'Transfer' | 'Bubar';
  asset: string;
  amount: number;
  valueInINR: number;
  status: 'Confirmed' | 'Pending' | 'Failed';
  date: string;
  txHash: string;
  recipient?: string;
}

export const MOCK_ASSETS: Asset[] = [
  { id: '1', name: 'Ethereum', symbol: 'ETH', balance: 2.45, priceInINR: 285430, change24h: 3.2, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: '2', name: 'Polygon', symbol: 'MATIC', balance: 1540.20, priceInINR: 85.40, change24h: -1.5, icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  { id: '3', name: 'Solana', symbol: 'SOL', balance: 45.8, priceInINR: 12450, change24h: 5.8, icon: 'https://cryptologos.cc/logos/solana-sol-logo.png' },
  { id: '4', name: 'Tether', symbol: 'USDT', balance: 5000, priceInINR: 83.25, change24h: 0.01, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    type: 'Transfer',
    asset: 'ETH',
    amount: 0.5,
    valueInINR: 142715,
    status: 'Confirmed',
    date: format(new Date(2026, 2, 25), 'dd MMM yyyy, HH:mm'),
    txHash: '0x7a2b...c4d5',
    recipient: 'Garv Khandelwal (Jaipur, RJ)'
  },
  {
    id: 'tx2',
    type: 'Deposit',
    asset: 'MATIC',
    amount: 500,
    valueInINR: 42700,
    status: 'Confirmed',
    date: format(new Date(2026, 2, 24), 'dd MMM yyyy, HH:mm'),
    txHash: '0x1e9f...a8b2'
  },
  {
    id: 'tx3',
    type: 'Bubar',
    asset: 'Portfolio',
    amount: 1,
    valueInINR: 854300,
    status: 'Confirmed',
    date: format(new Date(2026, 2, 20), 'dd MMM yyyy, HH:mm'),
    txHash: '0xbb44...e123',
    recipient: 'Liquidation Pool (Kota, RJ)'
  }
];

export const ETH_7D_HISTORY = [
  { day: 'Day 1', price: 285000 },
  { day: 'Day 2', price: 291200 },
  { day: 'Day 3', price: 288400 },
  { day: 'Day 4', price: 295100 },
  { day: 'Day 5', price: 292000 },
  { day: 'Day 6', price: 298500 },
  { day: 'Day 7', price: 302400 },
];

export const MARKET_FEED_INITIAL = [
  { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', price: 5845000, change24h: 1.2 },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', price: 285430, change24h: 3.2 },
  { id: 'polygon', symbol: 'MATIC', name: 'Polygon', price: 85.40, change24h: -1.5 },
  { id: 'solana', symbol: 'SOL', name: 'Solana', price: 12450, change24h: 5.8 },
];

export const INDIAN_INSTITUTIONS = [
  { name: 'Rajasthan Technical University', city: 'Kota', state: 'Rajasthan' },
  { name: 'SKIT Jaipur', city: 'Jaipur', state: 'Rajasthan' },
  { name: 'Malaviya National Institute of Technology', city: 'Jaipur', state: 'Rajasthan' }
];
