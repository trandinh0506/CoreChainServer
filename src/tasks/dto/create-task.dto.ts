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
import { Priority, Status } from 'src/projects/schemas/project.schema';

export class CreateTaskDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  attachments: Array<string>;

  @IsNotEmpty()
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @IsNotEmpty()
  assignedTo: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  projectId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  priority: Priority;

  @IsNotEmpty()
  status: Status;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  DueDate: Date;
}
