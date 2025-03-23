import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type ConversationDocument = HydratedDocument<Conversation>;
export interface PopulatedUser {
  _id: Types.ObjectId;
  name: string;
}

export type ConversationPopulated = Conversation & {
  participants: PopulatedUser[];
};

export type ConversationPopulatedDocument =
  HydratedDocument<ConversationPopulated>;

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop({
    type: [{ type: Types.ObjectId }],
    ref: User.name,
    required: true,
  })
  participants: Types.ObjectId[];

  @Prop()
  groupName?: string;

  @Prop({
    type: {
      _id: { type: Types.ObjectId, ref: User.name },
      name: String,
    },
  })
  admin?: {
    _id: Types.ObjectId;
    name: string;
  };

  @Prop({ type: Types.ObjectId, ref: User.name })
  createdBy?: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  lastActivity: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
