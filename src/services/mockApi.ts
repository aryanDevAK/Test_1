import { Asset, Transaction, MOCK_ASSETS, MOCK_TRANSACTIONS } from '../lib/mockData';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  location: string;
}

export const MOCK_USERS = [
  { email: 'aarav.sharma@gmail.com', name: 'Aarav Sharma', location: 'Mumbai, MH' },
  { email: 'priya.verma@gmail.com', name: 'Priya Verma', location: 'Delhi, DL' },
  { email: 'rohan.mehra@gmail.com', name: 'Rohan Mehra', location: 'Bangalore, KA' },
];

export const MOCK_WALLET_ADDRESSES = [
  '0x8F3a2F91d9A4e9c3D52aD4d3F12E8c1B7dA1F903',
  '0xA91F42dC5E12a3eE4D8A0c32F8D912b4d1E31c72'
];

export const EXTENDED_MOCK_ASSETS: Asset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: 0.52, priceInINR: 5845000, change24h: 1.2, icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: 4.8, priceInINR: 285430, change24h: 3.2, icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { id: 'matic', name: 'Polygon', symbol: 'MATIC', balance: 820, priceInINR: 85.40, change24h: -1.5, icon: 'https://cryptologos.cc/logos/polygon-matic-logo.png' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', balance: 1200, priceInINR: 83.25, change24h: 0.01, icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
];

export const mockApi = {
  getUserProfile: async (email: string): Promise<UserProfile | null> => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) return null;
    return {
      ...user,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
    };
  },
  getBalances: async () => {
    return EXTENDED_MOCK_ASSETS;
  },
  getTransactions: async () => {
    return MOCK_TRANSACTIONS;
  }
};
