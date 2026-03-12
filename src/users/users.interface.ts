import { AdjustmentDto } from './dto/create-user.dto';

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
  _id: string;
  name: string;
  email: string;
  avatar: string;
  role:
    | string
    | {
        _id: string;
        name: string;
      };
  workingHours: number;
  employeeId: string;
  position:
    | string
    | {
        _id: string;
        name: string;
      };
  fcmToken?: string;
  department:
    | string
    | {
        _id: string;
        name: string;
      };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: {
    _id: string;
    email: string;
  };
  updatedBy: {
    _id: string;
    email: string;
  };
  deletedBy: {
    _id: string;
    email: string;
  };
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
  employeeContractCode?: string;
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
