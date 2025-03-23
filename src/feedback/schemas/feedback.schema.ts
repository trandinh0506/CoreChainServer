import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type FeedbackDocument = HydratedDocument<Feedback>;

@Schema({ timestamps: true })
export class Feedback {
  @Prop()
  encryptedEmployeeId: string;

  @Prop()
  category: string;

  @Prop()
  isFlagged: boolean;

  @Prop()
  wasDecrypted: boolean;

  @Prop()
  decryptionReason: string;

  @Prop({ type: Object })
  decryptedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  title: string;

  @Prop()
  content: string;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;
  //timestamp
  @Prop()
  createdAt: Date;

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const FeedbackSchema = SchemaFactory.createForClass(Feedback);
