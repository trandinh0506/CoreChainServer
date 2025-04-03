import mongoose, { Types } from 'mongoose';

export interface IPermission {
  _id: Types.ObjectId;
  name: string;
  apiPath: string;
  method: string;
  module: string;
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
