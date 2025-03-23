import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { timestamp } from 'rxjs';
import { Position } from 'src/positions/schemas/position.schema';
import { Role } from 'src/roles/schemas/role.schema';
import { User } from 'src/users/schemas/user.schema';

export type ContractDocument = HydratedDocument<Contract>;

@Schema({ timestamps: true })
export class Contract {
  @Prop()
  contractCode: string;

  @Prop()
  type: string;

  @Prop()
  file: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  employee: mongoose.Schema.Types.ObjectId;

  @Prop()
  salary: number;

  @Prop()
  allowances: number;

  @Prop()
  insurance: string;

  @Prop()
  workingHours: number;

  @Prop()
  leavePolicy: string;

  @Prop()
  terminationTerms: string;

  @Prop()
  confidentialityClause: string;

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

export const ContractSchema = SchemaFactory.createForClass(Contract);
