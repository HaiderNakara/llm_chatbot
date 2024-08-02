import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Conversation, ConversationSchema } from './schema/conversation.schema';
import { Message, MessageSchema } from './schema/message.schema';
import { HttpModule } from '@nestjs/axios';
import { AIService } from './ai.service';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Conversation.name, schema: ConversationSchema },

      {
        name: Message.name,
        schema: MessageSchema,
      },
    ]),
  ],
  controllers: [ChatsController],
  providers: [ChatsService, AIService],
})
export class ChatsModule {}
