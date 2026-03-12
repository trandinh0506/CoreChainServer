import {
  IsUUID,
  IsString,
  IsOptional,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateMessageDto {
  @IsUUID('all')
  conversationId: string;

  @IsUUID('all')
  senderId: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @ArrayNotEmpty()
  attachments?: string[];
}
