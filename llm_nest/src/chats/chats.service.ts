import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schema/conversation.schema';
import { Model } from 'mongoose';
import { Message, MessageDocument, Roles } from './schema/message.schema';
import { AIService } from './ai.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
    private readonly aiService: AIService,
  ) {}

  async create(createChatDto: CreateChatDto) {
    if (createChatDto.conversation_id) {
      const existingConversation = await this.conversationModel
        .findById(createChatDto.conversation_id)
        .populate({
          path: 'messages',
          model: Message.name,
        })
        .exec();

      if (!existingConversation) {
        throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
      }

      const ai_response = await this.aiService.query(
        createChatDto.query,
        createChatDto.model,
        existingConversation.messages.map((message) => ({
          role: message['role'],
          content: message['content'],
        })) as any,
      );

      const user_message = {
        conversation: existingConversation._id,
        content: createChatDto.query,
        role: Roles.user,
        model: createChatDto.model,
      };

      const ai_message = {
        conversation: existingConversation._id,
        content: ai_response.answer,
        role: Roles.system,
        model: createChatDto.model,
      };

      const messages = await this.messageModel.insertMany([
        user_message,
        ai_message,
      ]);

      existingConversation.messages = [
        ...existingConversation.messages,
        ...messages.map((message) => message._id),
      ];

      return this.conversationModel
        .findByIdAndUpdate(
          existingConversation._id,
          {
            $set: existingConversation,
          },
          {
            new: true,
          },
        )
        .populate({
          path: 'messages',
          model: Message.name,
        })
        .exec();
    } else {
      const query = await this.aiService.query(
        createChatDto.query,
        createChatDto.model,
        [] as any,
      );
      const ai_message = {
        content: query.answer,
        role: Roles.system,
        model: query.model,
      };
      const user_message = {
        content: createChatDto.query,
        role: Roles.user,
        model: createChatDto.model,
      };
      const messages = await this.messageModel.insertMany([
        user_message,
        ai_message,
      ]);

      const conversation = new this.conversationModel({
        messages: messages.map((message) => message._id),
      });
      conversation.lastMessageAt = new Date();
      await conversation.save();
      conversation.messages = messages as any;
      return conversation;
    }
  }

  async findAll() {
    return this.conversationModel
      .find()
      .sort({ lastMessageAt: -1 })
      .populate({
        path: 'messages',
        model: Message.name,
      })
      .exec();
  }

  async findOne(id: string) {
    const conversation = await this.conversationModel
      .findById(id)
      .populate({
        path: 'messages',
        model: Message.name,
      })
      .exec();

    if (!conversation) {
      throw new HttpException('Conversation not found', HttpStatus.NOT_FOUND);
    }

    return conversation;
  }
}
