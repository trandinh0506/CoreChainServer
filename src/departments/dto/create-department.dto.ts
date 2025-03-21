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

  @IsNotEmpty({ message: 'Manager ID must not be empty !' })
  @IsMongoId()
  managerId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'EmployeeIds must not be empty !' })
  @IsMongoId({ each: true, message: 'EmployeeId has format mongo Id' })
  employeeIds: Array<mongoose.Schema.Types.ObjectId>;

  @IsNotEmpty({ message: 'Status must not be empty !' })
  status: string;

  @IsNotEmpty({ message: 'Budget must not be empty !' })
  @IsNumber({}, { message: 'Budget is number' })
  budget: number;

  @IsNotEmpty({ message: 'ProjectIds must not be empty !' })
  @IsMongoId({ each: true, message: 'ProjectIds has format mongo Id' })
  projectIds: Array<mongoose.Schema.Types.ObjectId>;
}
