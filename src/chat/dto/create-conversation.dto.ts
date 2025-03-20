import {
  IsArray,
  ArrayMinSize,
  IsMongoId,
  IsString,
  ValidateNested,
  ValidateIf,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AdminDto {
  @IsMongoId({ message: 'Admin _id must be a valid mongoId.' })
  _id: string;

  @IsString({ message: 'Admin name must be a string.' })
  name: string;
}

export class CreateConversationDto {
  @IsArray()
  @ArrayMinSize(2, { message: 'At least 2 participants in a conversation.' })
  @IsMongoId({
    each: true,
    message: 'Each participant must be a valid mongoId.',
  })
  participants: string[];

  @IsOptional()
  @IsString({ message: 'Group name must be a string.' })
  groupName?: string;

  // Chỉ validate admin nếu groupName có giá trị (nghĩa là conversation là group)
  @ValidateIf((o) => o.groupName != null)
  @ValidateNested()
  @Type(() => AdminDto)
  admin: AdminDto;
}
