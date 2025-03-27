import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type SalaryAdvanceDocument = HydratedDocument<SalaryAdvance>;

@Schema({ collection: 'salary-advances', timestamps: true })
export class SalaryAdvance {
  @Prop()
  employee: mongoose.Schema.Types.ObjectId;

  @Prop()
  amount: number;

  @Prop()
  reason: string;

  @Prop()
  isApproved: boolean;

  @Prop({ type: Object })
  approvedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  returnDate: Date;

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

export const SalaryAdvanceSchema = SchemaFactory.createForClass(SalaryAdvance);
