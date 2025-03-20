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
  role: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
  };
  //permissions: [string]
  @IsOptional()
  @Transform(({ value }) => (value === undefined ? 0 : value))
  // @IsNumber({}, { message: 'Working hours must be number !' })
  workingHours: number;

  //private infomation
  @IsNotEmpty({ message: 'Employee ID must not be empty !' })
  @IsString()
  employeeId: string;

  @IsNotEmpty({ message: 'Personal Identificaion Number must not be empty !' })
  @IsString()
  personalIdentificationNumber: string;

  @IsOptional()
  @IsMongoId()
  position: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  department: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  employeeContractId: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsDate()
  startDate: Date;
  @IsOptional()
  @IsDate()
  terminationDate: Date;

  @IsOptional()
  @IsString()
  personalTaxIdentificationNumber: string;
  @IsOptional()
  @IsString()
  socialInsuranceNumber: string;
  @IsOptional()
  @IsString()
  backAccountNumber: string;
}
