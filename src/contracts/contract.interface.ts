import mongoose, { Types } from 'mongoose';

export interface IContract {
  _id: Types.ObjectId;
  contractCode: string;
  type: string;
  file: string;
  startDate: Date;
  endDate: Date;
  status: string;
  employee:
    | mongoose.Schema.Types.ObjectId
    | {
        name: string;
        email: string;
      };
  salary: number;
  allowances: number;
  insurance: string;
  workingHours: number;
  leavePolicy: string;
  terminationTerms: string;
  confidentialityClause: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}
