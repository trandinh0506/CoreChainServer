import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ConversationDocument = HydratedDocument<Conversation>;

@Schema()
export class Conversation {
  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], required: true })
  participants: Types.ObjectId[];

  @Prop()
  groupName?: string;

  @Prop({
    type: {
      _id: { type: Types.ObjectId, ref: 'User' },
      name: String,
    },
  })
  admin?: {
    _id: Types.ObjectId;
    name: string;
  };

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

// export interface Message {
//   _id: Types.ObjectId;
//   senderId: string;
//   content?: string;
//   attachments?: string[];
//   status: 'sent' | 'received' | 'read';
//   readBy: {
//     _id: Types.ObjectId;
//     name: string;
//     avt: string;
//   }[];
//   createdAt: Date;
//   isDeleted: boolean;
// }
