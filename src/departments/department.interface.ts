import mongoose, { Types } from 'mongoose';

export interface IDepartment {
  _id: Types.ObjectId;
  name: string;
  code: string;
  description: string;
  manager: mongoose.Schema.Types.ObjectId;
  employees: Array<mongoose.Schema.Types.ObjectId>;
  status: string;
  budget: number;
  projectIds: Array<mongoose.Schema.Types.ObjectId>;
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
