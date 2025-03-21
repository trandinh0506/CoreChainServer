import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Task } from 'src/tasks/schemas/task.schema';

export type ProjectDocument = HydratedDocument<Project>;

export enum Status {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  ON_HOLD = 'On Hold',
  CANCELLED = 'Cancelled',
}
export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical',
}
@Schema({ timestamps: true })
export class Project {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  attachments: Array<string>;

  @Prop()
  teamMembers: Array<mongoose.Schema.Types.ObjectId>;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Task.name })
  tasks: Array<mongoose.Schema.Types.ObjectId>;

  @Prop()
  expenses: Array<{
    cost: number;
    reason: string;
  }>;

  @Prop()
  revenue: number;

  @Prop()
  priority: Priority;

  @Prop()
  status: Status;

  @Prop()
  progess: number;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: null })
  actualEndDate: Date;

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

export const ProjectSchema = SchemaFactory.createForClass(Project);
