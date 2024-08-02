import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatResponseDto, CreateChatDto } from './dto/create-chat.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('chats')
@ApiTags('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Post('query')
  @ApiResponse({
    status: 201,
    description: 'The chat has been successfully created.',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Conversation not found',
  })
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Get()
  @ApiResponse({
    status: 200,
    description: 'The chats has been successfully retrieved.',
    type: [ChatResponseDto],
  })
  findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The chat has been successfully retrieved.',
    type: ChatResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Chat not found',
  })
  findOne(@Param('id') id: string) {
    return this.chatsService.findOne(id);
  }
}
