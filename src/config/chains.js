/**
 * Custom Chain Definitions
 * Defines custom chains not included in wagmi/chains
 */

import { defineChain } from 'viem';

// Monad Testnet Chain Definition
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
    public: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Testnet Explorer',
      url: 'https://explorer.testnet.monad.xyz',
    },
  },
  testnet: true,
});

export default {
  monadTestnet,
};