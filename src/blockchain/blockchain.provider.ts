// src/blockchain/blockchain.provider.ts
import { Provider } from '@nestjs/common';
import Web3 from 'web3';
import * as ContractABI from './build/contracts/EmployeeRegistry.json';
import { ConfigService } from '@nestjs/config';

export const BlockchainProvider = {
  provide: 'BLOCKCHAIN_PROVIDER',
  useFactory: async (configService: ConfigService) => {
    const web3 = new Web3(configService.get<string>('BLOCKCHAIN_ENDPOINT'));

    const privateKey = configService.get<string>('PRIVATE_KEY');
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);

    // Contract
    const contractAddress = configService.get<string>('CONTRACT_ADDRESS');
    const contract = new web3.eth.Contract(ContractABI.abi, contractAddress);

    return {
      web3,
      contract,
      account: account.address,
    };
  },
  inject: [ConfigService],
};
