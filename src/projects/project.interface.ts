import mongoose, { Types } from 'mongoose';

export interface IProject {
  _id: Types.ObjectId;
  name: string;
  description: string;
  attachments: Array<string>;
  department: mongoose.Schema.Types.ObjectId;
  manager: mongoose.Schema.Types.ObjectId;
  teamMembers: Array<mongoose.Schema.Types.ObjectId>;
  tasks: mongoose.Schema.Types.ObjectId[];
  expenses: Array<{
    cost: number;
    reason: string;
  }>;
  revenue: number;
  priority: number;
  status: number;
  progress: number;
  startDate: Date;
  endDate: Date;
  actualEndDate: Date;
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
