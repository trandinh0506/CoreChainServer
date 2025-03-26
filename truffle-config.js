const HDWalletProvider = require('@truffle/hdwallet-provider');
require('dotenv').config();

const MNEMONIC = process.env.MNEMONIC;
const INFURA_API_KEY = process.env.INFURA_API_KEY;
const BLOCKCHAIN_ENDPOINT = process.env.BLOCKCHAIN_ENDPOINT;

module.exports = {
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '*',
    },
    sepolia: {
      provider: () =>
        new HDWalletProvider(
          MNEMONIC,
          BLOCKCHAIN_ENDPOINT,
          // 'https://ethereum-sepolia-rpc.publicnode.com',
        ),
      network_id: 11155111, // Sepolia network ID
      gas: 8000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  compilers: {
    solc: {
      version: '0.8.19',
    },
  },
  contracts_directory: './src/blockchain/contracts',
  contracts_build_directory: './src/blockchain/build/contracts',
  migrations_directory: './src/blockchain/migrations',
};
