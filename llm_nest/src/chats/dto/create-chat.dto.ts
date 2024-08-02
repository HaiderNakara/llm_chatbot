import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsMongoId, IsOptional, IsString } from 'class-validator';

export enum Models {
  llama2 = 'llama2',
  mistral = 'mistral',
}

export class CreateChatDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  conversation_id?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  query: string;
  @ApiProperty({ enum: Models })
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
