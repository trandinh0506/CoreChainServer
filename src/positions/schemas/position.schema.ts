import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, mongo } from 'mongoose';
import { timestamp } from 'rxjs';
import { Role } from 'src/roles/schemas/role.schema';

export type PositionDocument = HydratedDocument<Position>;

@Schema({ timestamps: true })
export class Position {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  parentId: mongoose.Schema.Types.ObjectId;

  @Prop()
  level: number;

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

export const PositionSchema = SchemaFactory.createForClass(Position);
