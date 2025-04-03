import mongoose from 'mongoose';

export interface ITask {
  name: string;
  title: string;
  description: string;
  attachments: Array<string>;
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  assignedTo: mongoose.Schema.Types.ObjectId;
  projectId: mongoose.Schema.Types.ObjectId;
  priority: number;
  status: number;
  startDate: Date;
  DueDate: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}
