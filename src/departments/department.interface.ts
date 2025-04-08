import mongoose, { Types } from 'mongoose';

export interface IDepartment {
  _id: Types.ObjectId;
  name: string;
  code: string;
  description: string;
  manager: mongoose.Schema.Types.ObjectId | string;
  employees: Array<mongoose.Schema.Types.ObjectId | string>;
  status: string;
  budget: number;
  projectIds: Array<mongoose.Schema.Types.ObjectId | string>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId | string;
    email: string;
  };
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId | string;
    email: string;
  };
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId | string;
    email: string;
  };
}
