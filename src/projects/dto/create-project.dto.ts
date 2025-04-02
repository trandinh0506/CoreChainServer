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

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  attachments: Array<string>;

  @IsNotEmpty()
  department: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsArray()
  teamMembers: Array<mongoose.Schema.Types.ObjectId>;

  @IsOptional()
  @IsArray()
  tasks: Array<mongoose.Schema.Types.ObjectId>;

  @IsOptional()
  expenses: Array<{
    cost: number;
    reason: string;
  }>;

  @IsNotEmpty()
  revenue: number;

  @IsNotEmpty()
  priority: number;

  @IsNotEmpty()
  status: number;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsOptional()
  actualEndDate: Date;
}
