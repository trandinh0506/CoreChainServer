import mongoose from 'mongoose';
import { AdjustmentDto } from './dto/update-user.dto';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: {
    _id: string;
    name: string;
  };
  permissions?: {
    _id: string;
    name: string;
    apiPath: string;
    module: string;
  }[];
}

export interface PublicUser {
  name: string;
  email: string;
  avatar: string;
  role: mongoose.Schema.Types.ObjectId;
  workingHours: number;
  employeeId: string;
  position: mongoose.Schema.Types.ObjectId;
  department: mongoose.Schema.Types.ObjectId;
}
export interface PrivateUser {
  netSalary?: number;
  personalIdentificationNumber: string;
  dateOfBirth?: Date;
  personalPhoneNumber?: string;
  male?: boolean;
  nationality?: string;
  permanentAddress?: string;
  biometricData?: string;
  employeeContractCode?: mongoose.Schema.Types.ObjectId;
  salary?: number;
  allowances?: number;
  adjustments?: AdjustmentDto[];
  loansSupported?: number;
  healthCheckRecordCode?: string[];
  medicalHistory?: string;
  healthInsuranceCode?: string;
  lifeInsuranceCode?: string;
  socialInsuranceNumber?: string;
  personalTaxIdentificationNumber?: string;
  backAccountNumber?: string;
}
export interface CompleteUser extends PublicUser, PrivateUser {}
