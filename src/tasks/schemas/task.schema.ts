import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ timestamps: true })
export class Task {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  attachments: Array<string>;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  assignedTo: mongoose.Schema.Types.ObjectId;

  @Prop()
  projectId: mongoose.Schema.Types.ObjectId;

  @Prop()
  priority: number;

  @Prop()
  status: number;

  @Prop()
  startDate: Date;

  @Prop()
  DueDate: Date;

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

export const TaskSchema = SchemaFactory.createForClass(Task);
