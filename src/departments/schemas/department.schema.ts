import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type DepartmentDocument = HydratedDocument<Department>;

@Schema({ timestamps: true })
export class Department {
  @Prop()
  name: string;

  @Prop()
  code: string;

  @Prop()
  description: string;

  @Prop()
  manager: string;

  @Prop()
  status: string;

  @Prop()
  budget: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  // ref: Project.name
  projectIds: Array<mongoose.Schema.Types.ObjectId>;

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

export const DepartmentSchema = SchemaFactory.createForClass(Department);
