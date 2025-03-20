import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: Types.ObjectId, ref: 'Conversation', required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId;
  @Prop()
  content?: string;

  @Prop()
  attachments?: string[];

  @Prop()
  readBy: {
    _id: Types.ObjectId;
    name: string;
    avt: string;
  }[];

  @Prop()
  createdAt: Date;

  @Prop()
  isDeleted: boolean;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
