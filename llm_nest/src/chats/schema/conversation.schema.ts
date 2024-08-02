import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import { Message } from './message.schema';

@Schema({ timestamps: true })
export class Conversation {

  @Prop({ default: Date.now })
  lastMessageAt: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: Message.name }] })
  messages: Types.ObjectId[];
}

export type ConversationDocument = HydratedDocument<Conversation>;
export const ConversationSchema = SchemaFactory.createForClass(Conversation);