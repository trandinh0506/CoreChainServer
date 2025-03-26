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
import mongoose from 'mongoose';

export class CreateTaskDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsArray()
  attachments: Array<string>;

  @IsNotEmpty()
  @IsMongoId()
  assignedTo: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  projectId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  priority: number;

  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  dueDate: Date;
}
