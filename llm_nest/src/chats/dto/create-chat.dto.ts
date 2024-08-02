import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

export enum Models {
  llama2 = 'llama2',
  mistral = 'mistral',
}

export class CreateChatDto {
  @ApiPropertyOptional({
    description:
      'It is optional, if not provided, it will create a new conversation',
    example: '66ac7cc02b2de3908383389a',
  })
  @IsMongoId()
  @IsOptional()
  conversation_id?: string;
  @ApiProperty({
    description: 'The query to search for the conversation',
    example: 'What is meaning of life?',
  })
  @IsString()
  @IsOptional()
  query: string;
  @ApiProperty({
    enum: Models,
    description: 'The model to use for the conversation',
    example: Models.llama2,
  })
  @IsEnum(Models)
  model: string;
}

export class MessageResponseDto {
  @ApiProperty()
  _id: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  role: string;
  @ApiProperty()
  model: string;
  @ApiProperty()
  __v: number;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}

export class ChatResponseDto {
  @ApiProperty()
  _id: string;
  @ApiProperty({ type: MessageResponseDto, isArray: true })
  messages: MessageResponseDto[];
  @ApiProperty()
  lastMessageAt: Date;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  __v: number;
}
