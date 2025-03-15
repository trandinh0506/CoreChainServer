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
        this.logger.error('Không tìm thấy định danh "admin" trong wallet');
        throw new Error('Không tìm thấy định danh "admin" trong wallet');
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

      this.logger.log('Kết nối thành công với Hyperledger Fabric');
    } catch (error) {
      this.logger.error(`Lỗi kết nối: ${error}`);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.gateway) {
      this.gateway.disconnect();
      this.logger.log('Đã ngắt kết nối với Hyperledger Fabric');
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

      return { success: true, message: 'Đã tạo nhân viên thành công' };
    } catch (error) {
      this.logger.error(`Lỗi khi tạo nhân viên: ${error}`);
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
      this.logger.error(`Lỗi khi lấy thông tin nhân viên: ${error}`);
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

      return { success: true, message: 'Đã cập nhật nhân viên thành công' };
    } catch (error) {
      this.logger.error(`Lỗi khi cập nhật nhân viên: ${error}`);
      throw error;
    }
  }

  async deleteEmployee(id: string): Promise<any> {
    try {
      if (!this.contract) {
        await this.connect();
      }

      await this.contract.submitTransaction('deleteEmployee', id);

      return { success: true, message: 'Đã xóa nhân viên thành công' };
    } catch (error) {
      this.logger.error(`Lỗi khi xóa nhân viên: ${error}`);
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
      this.logger.error(`Lỗi khi truy vấn nhân viên: ${error}`);
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
      this.logger.error(`Lỗi khi lấy tất cả nhân viên: ${error}`);
      throw error;
    }
  }
}
