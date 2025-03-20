import dotenv from 'dotenv';
dotenv.config();
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  blockchain: {
    endpoint: process.env.BLOCKCHAIN_ENDPOINT,
    privateKey: process.env.PRIVATE_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS,
  },
});
