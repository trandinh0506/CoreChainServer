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


export class CreateProjectDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  attachments: Array<string>;

  @IsNotEmpty()
  department: string;

  @IsNotEmpty()
  manager: string;

  @IsOptional()
  @IsArray()
  teamMembers: Array<string>;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  tasks: Array<string>;

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
