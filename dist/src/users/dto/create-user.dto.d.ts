import mongoose from 'mongoose';
export declare class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: string;
    workingHours: number;
    employeeId: string;
    personalIdentificationNumber: string;
    position: mongoose.Schema.Types.ObjectId;
    department: mongoose.Schema.Types.ObjectId;
    employeeContractId: mongoose.Schema.Types.ObjectId;
    startDate: Date;
    terminationDate: Date;
    personalTaxIdentificationNumber: string;
    socialInsuranceNumber: string;
    backAccountNumber: string;
}
