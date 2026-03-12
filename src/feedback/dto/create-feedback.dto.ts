import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';


export class CreateFeedbackDto {
  @IsNotEmpty()
sender: string;

  @IsNotEmpty()
  category: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  content: string;
}
