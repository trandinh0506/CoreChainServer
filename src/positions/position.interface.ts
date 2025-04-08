import mongoose, { Types } from 'mongoose';

export interface IPosition {
  _id: Types.ObjectId;
  title: string;
  description: string;
  parentId: mongoose.Schema.Types.ObjectId;
  level: number;
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
