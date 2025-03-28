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

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;

  @IsEmail({}, { message: 'Email is invalid !' })
  @IsNotEmpty({ message: 'Email must not be empty !' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty !' })
  password: string;

  @IsNotEmpty({ message: 'Role must not be empty !' })
  role: mongoose.Schema.Types.ObjectId;

  @IsOptional({ message: 'Working hours must not be empty !' })
  @Transform(({ value }) => (value === undefined ? 0 : value))
  @IsNumber({}, { message: 'Working hours must be number !' })
  workingHours: number;

  @IsNotEmpty({ message: 'Employee ID must not be empty !' })
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsMongoId()
  position: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Department must not be empty !' })
  @IsMongoId()
  department: mongoose.Schema.Types.ObjectId;
}
