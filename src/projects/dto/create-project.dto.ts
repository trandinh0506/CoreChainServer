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
import mongoose from 'mongoose';
import { Priority, Status } from '../schemas/project.schema';

export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  attachments: Array<string>;

  @IsNotEmpty()
  teamMembers: Array<mongoose.Schema.Types.ObjectId>;

  @IsOptional()
  tasks: Array<mongoose.Schema.Types.ObjectId>;

  @IsOptional()
  expenses: Array<{
    cost: number;
    reason: string;
  }>;

  @IsNotEmpty()
  revenue: number;

  @IsNotEmpty()
  priority: Priority;

  @IsNotEmpty()
  status: Status;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsOptional()
  actualEndDate: Date;
}
