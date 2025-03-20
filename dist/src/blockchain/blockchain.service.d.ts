import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmployeeBlockchainData } from './interfaces/employee.interface';
import { SecurityService } from 'src/security/security.service';
export declare class BlockchainService implements OnModuleInit {
    private configService;
    private securityService;
    private readonly blockchainProvider;
    private web3;
    private employeeRegistry;
    private account;
    constructor(configService: ConfigService, securityService: SecurityService, blockchainProvider: any);
    onModuleInit(): Promise<void>;
    getBalance(address: string): Promise<string>;
    callContractMethod(methodName: string, ...args: any[]): Promise<any>;
    executeContractMethod(methodName: string, ...args: any[]): Promise<any>;
    addEmployee(employeeData: EmployeeBlockchainData): Promise<string>;
    updateEmployee(employeeData: EmployeeBlockchainData): Promise<string>;
    deactivateEmployee(employeeId: string): Promise<string>;
    getEmployee(employeeId: string): Promise<EmployeeBlockchainData>;
    getAllEmployeeIds(): Promise<string[]>;
}
