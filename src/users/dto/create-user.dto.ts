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

  @IsNotEmpty({ message: 'Working hours must not be empty !' })
  @Transform(({ value }) => (value === undefined ? 0 : value))
  @IsNumber({}, { message: 'Working hours must be number !' })
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

  @IsNotEmpty({ message: 'DepartmentId must not be empty !' })
  @IsMongoId()
  departmentId: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  employeeContractId: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsDate()
  startDate: Date;
  @IsOptional()
  @IsDate()
  terminationDate: Date;

  @IsNotEmpty({
    message: 'Personal Tax Idenification Number must not be empty !',
  })
  @IsString()
  personalTaxIdentificationNumber: string;

  @IsNotEmpty({ message: 'Social Insurance Number must not be empty !' })
  @IsString()
  socialInsuranceNumber: string;

  @IsNotEmpty({ message: 'Bank Account must not be empty !' })
  @IsString()
  backAccountNumber: string;
}
