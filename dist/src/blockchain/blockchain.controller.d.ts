import { BlockchainService } from './blockchain.service';
import { EmployeeBlockchainData } from './interfaces/employee.interface';
export declare class BlockchainController {
    private readonly blockchainService;
    constructor(blockchainService: BlockchainService);
    addEmployee(employeeData: EmployeeBlockchainData): Promise<{
        success: boolean;
        transactionHash: string;
    }>;
    updateEmployee(employeeData: EmployeeBlockchainData): Promise<{
        success: boolean;
        transactionHash: string;
    }>;
    deactivateEmployee(employeeId: string): Promise<{
        success: boolean;
        transactionHash: string;
    }>;
    getEmployee(employeeId: string): Promise<EmployeeBlockchainData>;
    getAllEmployeeIds(): Promise<string[]>;
}
