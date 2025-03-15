import { Injectable, Logger } from '@nestjs/common';
import { Gateway, Wallets, Network, Contract } from 'fabric-network';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class BlockchainService {
  private gateway: Gateway;
  private network: Network;
  private contract: Contract;
  private readonly logger = new Logger(BlockchainService.name);

  constructor() {}

  async connect(): Promise<void> {
    try {
      const ccpPath = path.resolve(
        __dirname,
        'config',
        'connection-profile.json',
      );
      const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

      // Create a wallet object to manage identities
      const walletPath = path.join(__dirname, 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      // Check if the user is already in the wallet
      const identity = await wallet.get('admin');
      if (!identity) {
        this.logger.error('Identifier "admin" not found in wallet');
        throw new Error('Identifier "admin" not found in wallet');
      }

      // Create a gateway to connect to the blockchain network
      this.gateway = new Gateway();
      await this.gateway.connect(ccp, {
        wallet,
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: true },
      });

      // Get network and contract
      this.network = await this.gateway.getNetwork('hrmchannel');
      this.contract = this.network.getContract('hrm-contract');

      this.logger.log('Successfully connected to Hyperledger Fabric');
    } catch (error) {
      this.logger.error(`Connection error: ${error}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.gateway) {
      this.gateway.disconnect();
      this.logger.log('Disconnected from Hyperledger Fabric');
    }
  }

  async createEmployee(id: string, employeeData: any): Promise<any> {
    try {
      if (!this.contract) {
        await this.connect();
      }

      const data = JSON.stringify(employeeData);

      // Call smart contract to create employee
      await this.contract.submitTransaction('createEmployee', id, data);

      return { success: true, message: 'Employee created successfully' };
    } catch (error) {
      this.logger.error(`Error creating employee: ${error}`);
      throw error;
    }
  }

  async getEmployee(id: string): Promise<any> {
    try {
      if (!this.contract) {
        await this.connect();
      }

      // Get info employee
      const result = await this.contract.evaluateTransaction('getEmployee', id);

      return JSON.parse(result.toString());
    } catch (error) {
      this.logger.error(`Error retrieving employee information: ${error}`);
      throw error;
    }
  }

  async updateEmployee(id: string, employeeData: any): Promise<any> {
    try {
      if (!this.contract) {
        await this.connect();
      }

      const data = JSON.stringify(employeeData);

      await this.contract.submitTransaction('updateEmployee', id, data);

      return { success: true, message: 'Employee updated successfully' };
    } catch (error) {
      this.logger.error(`Error while updating employee: ${error}`);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<any> {
    try {
      if (!this.contract) {
        await this.connect();
      }

      await this.contract.submitTransaction('deleteEmployee', id);

      return { success: true, message: 'Employee deleted successfully' };
    } catch (error) {
      this.logger.error(`Error while deleting employee: ${error}`);
      throw error;
    }
  }

  async queryEmployees(query: string): Promise<any> {
    try {
      if (!this.contract) {
        await this.connect();
      }

      const result = await this.contract.evaluateTransaction(
        'queryEmployees',
        query,
      );

      return JSON.parse(result.toString());
    } catch (error) {
      this.logger.error(`Error querying employee: ${error}`);
      throw error;
    }
  }

  async getAllEmployees(): Promise<any> {
    try {
      if (!this.contract) {
        await this.connect();
      }

      const result = await this.contract.evaluateTransaction('getAllEmployees');

      return JSON.parse(result.toString());
    } catch (error) {
      this.logger.error(`Error while getting all employees: ${error}`);
      throw error;
    }
  }
}
