import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';




export enum Roles {
  user = 'user',
  system = 'system',
}

@Schema({ timestamps: true })
export class Message {

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, enum: ['user', 'system'] })
  role: string;

  @Prop()
  model?: string;
}


export type MessageDocument = HydratedDocument<Message>;
export const MessageSchema = SchemaFactory.createForClass(Message);