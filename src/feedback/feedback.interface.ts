import mongoose, { Types } from 'mongoose';

export interface IFeedback {
  _id: Types.ObjectId;
  encryptedEmployeeId: string;
  category: string;
  isFlagged: boolean;
  wasDecrypted: boolean;
  decryptionReason: string;
  decryptedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
  approvedBy: string;
  title: string;
  content: string;
  isDeleted: boolean;
  createdAt: Date;
  deletedAt: Date;
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}
