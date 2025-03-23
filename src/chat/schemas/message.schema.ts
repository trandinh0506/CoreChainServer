import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Conversation } from './conversation.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: Conversation.name, required: true })
  conversationId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
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
