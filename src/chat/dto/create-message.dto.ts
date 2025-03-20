import {
  IsMongoId,
  IsString,
  IsOptional,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  conversationId: string;

  @IsMongoId()
  senderId: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @ArrayNotEmpty()
  attachments?: string[];
}
