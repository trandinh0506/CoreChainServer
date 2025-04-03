import mongoose from 'mongoose';
import { PublicUser } from 'src/users/users.interface';

export interface IEmployeesDepartment {
  department: string;
  employees: PublicUser[];
}

export interface IEmployeesTurnover {
  resignedEmployees: PublicUser[];
  newEmployees: PublicUser[];
}

export interface IWorkingHours {
  department: string;
  employees: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    avatar: string;
    workingHours: number;
  }[];
}

export interface IDayOff {
  department: string;
  employees: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    avatar: string;
    dayOff: number;
  }[];
}

export interface IKPI {
  department: string;
  employees: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    avatar: string;
    kpi: number;
  }[];
}

export interface ISalary {
  department: string;
  employees: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    avatar: string;
    salary: number;
    allowances: number;
    adjustments?: {
      reason: string;
      amount: number;
      createdAt?: Date;
    };
    netSalary: number;
  }[];
  amount: number;
}
