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

export class CreateDepartmentDto {
  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;

  @IsNotEmpty({ message: 'Department code must not be empty !' })
  code: string;

  @IsNotEmpty({ message: 'Description must not be empty !' })
  description: string;

  @IsOptional({ message: 'Manager ID must not be empty !' })
  @IsMongoId()
  manager: mongoose.Schema.Types.ObjectId;

  @IsOptional({ message: 'Employees ID must not be empty !' })
  @IsMongoId({ each: true })
  employees: Array<mongoose.Schema.Types.ObjectId | string>;

  @IsNotEmpty({ message: 'Status must not be empty !' })
  status: string;

  @IsNotEmpty({ message: 'Budget must not be empty !' })
  @IsNumber({}, { message: 'Budget is number' })
  budget: number;

  @IsOptional({ message: 'ProjectIds must not be empty !' })
  @IsMongoId({ each: true, message: 'ProjectIds has format mongo Id' })
  projectIds: Array<mongoose.Schema.Types.ObjectId>;
}
