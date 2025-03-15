import { Injectable, OnModuleInit } from '@nestjs/common';
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
      // Kết nối đến blockchain (Ganache)
      this.web3 = new Web3(
        this.configService.get<string>(
          'BLOCKCHAIN_URL',
          'http://localhost:7545',
        ),
      );

      // Lấy tài khoản mặc định
      const accounts = await this.web3.eth.getAccounts();
      this.account = accounts[0];

      // Kết nối với smart contract
      const networkId = await this.web3.eth.net.getId();
      const deployedNetwork =
        EmployeeRegistryArtifact.networks[networkId.toString()];

      this.employeeRegistry = new this.web3.eth.Contract(
        EmployeeRegistryArtifact.abi,
        deployedNetwork && deployedNetwork.address,
      );

      console.log('Blockchain service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize blockchain service:', error);
    }
  }

  async addEmployee(employeeData: EmployeeBlockchainData): Promise<string> {
    try {
      // Mã hóa dữ liệu nhân viên trước khi lưu trữ (trong thực tế bạn nên mã hóa dữ liệu nhạy cảm)
      const encryptedData = JSON.stringify(employeeData);

      // Gọi smart contract để thêm nhân viên
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

      // Giải mã dữ liệu (trong thực tế bạn sẽ giải mã dữ liệu đã mã hóa)
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
