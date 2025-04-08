import mongoose, { Types } from 'mongoose';

export interface ISalaryAdvance {
  _id: Types.ObjectId;
  employee: mongoose.Schema.Types.ObjectId;
  amount: number;
  reason: string;
  isApproved: boolean;
  approvedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  returnDate: Date;
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
