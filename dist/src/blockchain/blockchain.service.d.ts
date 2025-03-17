import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmployeeBlockchainData } from './interfaces/employee.interface';
export declare class BlockchainService implements OnModuleInit {
    private configService;
    private web3;
    private employeeRegistry;
    private account;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    addEmployee(employeeData: EmployeeBlockchainData): Promise<string>;
    updateEmployee(employeeData: EmployeeBlockchainData): Promise<string>;
    deactivateEmployee(employeeId: string): Promise<string>;
    getEmployee(employeeId: string): Promise<EmployeeBlockchainData>;
    getAllEmployeeIds(): Promise<string[]>;
}
