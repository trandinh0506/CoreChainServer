import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Web3 from 'web3';
import { EmployeeBlockchainData } from './interfaces/employee.interface';
import * as EmployeeRegistryArtifact from './build/contracts/EmployeeRegistry.json';
import { SecurityService } from 'src/security/security.service';
// import * as EmployeeRegistryArtifact from './contracts/EmployeeRegistry.sol';
@Injectable()
export class BlockchainService implements OnModuleInit {
  private web3: Web3;
  private employeeRegistry: any;
  private account: string;

  constructor(
    private configService: ConfigService,
    private securityService: SecurityService,
    @Inject('BLOCKCHAIN_PROVIDER') private readonly blockchainProvider: any,
  ) {}

  // async onModuleInit() {
  //   try {
  //     // Connect to blockchain (Ganache)
  //     this.web3 = new Web3(
  //       this.configService.get<string>(
  //         'BLOCKCHAIN_URL',
  //         'http://localhost:7545',
  //       ),
  //     );

  //     // Get default account
  //     const accounts = await this.web3.eth.getAccounts();
  //     this.account = accounts[0];

  //     // Connect to smart contract
  //     const networkId = await this.web3.eth.net.getId();
  //     console.log('Network ID:', networkId);

  //     const deployedNetwork =
  //       EmployeeRegistryArtifact.networks[networkId.toString()];
  //     console.log('Deployed Network:', deployedNetwork);

  //     this.employeeRegistry = new this.web3.eth.Contract(
  //       EmployeeRegistryArtifact.abi,
  //       deployedNetwork && deployedNetwork.address,
  //     );

  //     Logger.log('Blockchain service initialized successfully');
  //   } catch (error) {
  //     Logger.error('Failed to initialize blockchain service:', error);
  //   }
  // }
  async onModuleInit() {
    try {
      // Connect to blockchain (Chainstack)
      this.web3 = new Web3(
        this.configService.get<string>(
          'BLOCKCHAIN_ENDPOINT',
          'http://localhost:7545',
        ),
      );

      // private key
      const privateKey = this.configService.get<string>('PRIVATE_KEY');
      if (privateKey) {
        const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        this.web3.eth.accounts.wallet.add(account);
        this.account = account.address;
      } else {
        // Fallback to getting accounts (if node allow)
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
      }

      // connect to smart contract
      const contractAddress =
        this.configService.get<string>('CONTRACT_ADDRESS');
      this.employeeRegistry = new this.web3.eth.Contract(
        EmployeeRegistryArtifact.abi,
        contractAddress,
      );

      Logger.log('Blockchain service initialized successfully with Chainstack');
    } catch (error) {
      Logger.error('Failed to initialize blockchain service:', error);
    }
  }

  async getBalance(address: string): Promise<string> {
    const web3 = this.blockchainProvider.web3;
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
  }

  async callContractMethod(methodName: string, ...args: any[]): Promise<any> {
    const contract = this.blockchainProvider.contract;
    return contract.methods[methodName](...args).call();
  }

  async executeContractMethod(
    methodName: string,
    ...args: any[]
  ): Promise<any> {
    const contract = this.blockchainProvider.contract;
    const account = this.blockchainProvider.account;

    const tx = contract.methods[methodName](...args);
    const gas = await tx.estimateGas({ from: account });

    return tx.send({
      from: account,
      gas,
    });
  }

  async addEmployee(employeeData: EmployeeBlockchainData): Promise<string> {
    try {
      // Encrypt employee data before storing
      const encryptedData = this.securityService.encrypt(employeeData);

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
      const encryptedData = this.securityService.encrypt(employeeData);

      const result = await this.employeeRegistry.methods
        .updateEmployee(employeeData.employeeId, encryptedData)
        .send({ from: this.account, gas: 1000000 });

      return result.transactionHash;
    } catch (error) {
      console.error('Error updating employee on blockchain:', error);
      if (error.message.includes('Employee is not active')) {
        throw new BadRequestException('Cannot update an inactive employee.');
      } else {
        throw new InternalServerErrorException(
          'Blockchain transaction failed.',
        );
      }
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
      const employee = (await this.employeeRegistry.methods
        .getEmployee(employeeId)
        .call()) as EmployeeBlockchainData;
      const [id, encryptedData, timestamp, isActive] = Object.values(employee);

      console.log(id, encryptedData, timestamp, isActive);
      // Decrypt the data
      const employeeData = this.securityService.decrypt(
        this.securityService.decrypt(encryptedData).encryptedData,
      );
      return {
        ...employeeData,
        timestamp: new Date(Number(timestamp) * 1000),
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
