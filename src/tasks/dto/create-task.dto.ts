import { Optional } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';


export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  attachments: Array<string>;

  @IsNotEmpty()
  @IsMongoId()
  assignedTo: string;

  @IsNotEmpty()
  projectId: string;

  @IsNotEmpty()
  priority: number;

  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  dueDate: Date;
}
