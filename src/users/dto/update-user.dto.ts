import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
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
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  avatar: string;

  @IsNotEmpty({ message: 'Personal Identificaion Number must not be empty !' })
  @IsString()
  personalIdentificationNumber: string;

  @IsNotEmpty()
  dateOfBirth: Date;

  @IsNotEmpty()
  personalPhoneNumber: string;

  @IsNotEmpty()
  male: boolean;

  @IsNotEmpty()
  nationality: string;

  @IsNotEmpty()
  permanentAddress: string;

  @IsNotEmpty()
  biometricData: string;

  @IsNotEmpty()
  @IsMongoId()
  employeeContractCode: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @IsNotEmpty()
  @IsNumber()
  allowances: number;

  // @IsOptional()
  // @IsNumber()
  // loansSupported: number;

  @IsNotEmpty()
  healthCheckRecordCode: string[];

  @IsNotEmpty()
  medicalHistory: string;

  @IsNotEmpty()
  healthInsuranceCode: string;

  @IsNotEmpty()
  lifeInsuranceCode: string;

  @IsNotEmpty({ message: 'Social Insurance Number must not be empty !' })
  @IsString()
  socialInsuranceNumber: string;

  @IsNotEmpty({
    message: 'Personal Tax Idenification Number must not be empty !',
  })
  @IsString()
  personalTaxIdentificationNumber: string;

  @IsNotEmpty({ message: 'Bank Account must not be empty !' })
  @IsString()
  backAccountNumber: string;
}
