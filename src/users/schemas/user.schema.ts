import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { timestamp } from 'rxjs';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  role: string;

  @Prop()
  permissions: Array<string>;

  @Prop()
  walletAddress: string;

  @Prop()
  workingHours: number;

  @Prop()
  feedback: Array<{
    email: string;
    content: string;
    createdAt: Date;
  }>;

  @Prop()
  refreshToken: string;

  //private infomation
  @Prop()
  employeeId: string;
  @Prop()
  // personalIdentificationNumber: string;
  // @Prop()
  // position: mongoose.Schema.Types.ObjectId;
  // @Prop()
  // department: mongoose.Schema.Types.ObjectId;
  // @Prop()
  // employeeContractId: mongoose.Schema.Types.ObjectId;
  // @Prop()
  // startDate: Date;
  // @Prop()
  // terminationDate: Date;
  // @Prop()
  // personalTaxIdentificationNumber: string;
  // @Prop()
  // socialInsuranceNumber: string;
  // @Prop()
  // backAccountNumber: string;
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
  //timestamp
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);
