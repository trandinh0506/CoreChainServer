import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { EmployeeBlockchainData } from './interfaces/employee.interface';
import * as EmployeeRegistryArtifact from './build/contracts/EmployeeRegistry.json';
// import * as EmployeeRegistryArtifact from './contracts/EmployeeRegistry.sol';
@Injectable()
export class BlockchainService implements OnModuleInit {
  private web3: Web3;
  private employeeRegistry: any;
  private account: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    try {
      // Connect to blockchain (Ganache)
      this.web3 = new Web3(
        this.configService.get<string>(
          'BLOCKCHAIN_URL',
          'http://localhost:7545',
        ),
      );

      // Get default account
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];

      // Connect to smart contract
      const networkId = await this.web3.eth.net.getId();
      const deployedNetwork =
        EmployeeRegistryArtifact.networks[networkId.toString()];

      this.employeeRegistry = new this.web3.eth.Contract(
        EmployeeRegistryArtifact.abi,
        deployedNetwork && deployedNetwork.address,
      );

      Logger.log('Blockchain service initialized successfully');
    } catch (error) {
      Logger.error('Failed to initialize blockchain service:', error);
    }
  }

  async addEmployee(employeeData: EmployeeBlockchainData): Promise<string> {
    try {
      // Encrypt employee data before storing
      const encryptedData = JSON.stringify(employeeData);

      // Add employee by smart contract
      const result = await this.employeeRegistry.methods
        .addEmployee(employeeData.employeeId, encryptedData)
        .send({ from: this.account, gas: 1000000 });

      return result.transactionHash;
    } catch (error) {
      console.error('Error adding employee to blockchain:', error);
      throw error;
    }
  }

  async updateEmployee(employeeData: EmployeeBlockchainData): Promise<string> {
    try {
      const encryptedData = JSON.stringify(employeeData);

      const result = await this.employeeRegistry.methods
        .updateEmployee(employeeData.employeeId, encryptedData)
        .send({ from: this.account, gas: 1000000 });

      return result.transactionHash;
    } catch (error) {
      console.error('Error updating employee on blockchain:', error);
      throw error;
    }
  }

  async deactivateEmployee(employeeId: string): Promise<string> {
    try {
      const result = await this.employeeRegistry.methods
        .deactivateEmployee(employeeId)
        .send({ from: this.account, gas: 1000000 });

      return result.transactionHash;
    } catch (error) {
      console.error('Error deactivating employee on blockchain:', error);
      throw error;
    }
  }

  async getEmployee(employeeId: string): Promise<EmployeeBlockchainData> {
    try {
      const [id, encryptedData, timestamp, isActive] =
        await this.employeeRegistry.methods.getEmployee(employeeId).call();

      // Decrypt the data
      const employeeData = JSON.parse(encryptedData);

      return {
        ...employeeData,
        timestamp: Number(timestamp),
        isActive,
      };
    } catch (error) {
      console.error('Error getting employee from blockchain:', error);
      throw error;
    }
  }

  async getAllEmployeeIds(): Promise<string[]> {
    try {
      return await this.employeeRegistry.methods.getAllEmployeeIds().call();
    } catch (error) {
      console.error('Error getting all employee IDs from blockchain:', error);
      throw error;
    }
  }
}
