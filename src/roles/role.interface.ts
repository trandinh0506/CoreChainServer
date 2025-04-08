import mongoose, { Types } from 'mongoose';

export interface IRole {
  _id: Types.ObjectId;
  name: string;
  description: string;
  isActive: boolean;
  permissions: Array<mongoose.Schema.Types.ObjectId>;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  isDeleted: Boolean;
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
