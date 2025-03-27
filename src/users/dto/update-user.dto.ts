import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

export class AdjustmentDto {
  @IsNumber()
  amount: number;

  @IsString()
  reason: string;

  @IsOptional()
  createdAt?: Date;
}
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  avatar: string;

  @IsOptional({ message: 'Personal Identificaion Number must not be empty !' })
  @IsString()
  personalIdentificationNumber: string;

  @IsOptional()
  dateOfBirth: Date;

  @IsOptional()
  personalPhoneNumber: string;

  @IsOptional()
  male: boolean;

  @IsOptional()
  nationality: string;

  @IsOptional()
  permanentAddress: string;

  @IsOptional()
  biometricData: string;

  @IsOptional()
  @IsMongoId()
  employeeContractCode: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  @IsNumber()
  salary: number;

  @IsOptional()
  @IsNumber()
  allowances: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdjustmentDto)
  adjustments: AdjustmentDto[];

  // @IsOptional()
  // @IsNumber()
  // loansSupported: number;

  @IsOptional()
  healthCheckRecordCode: string[];

  @IsOptional()
  medicalHistory: string;

  @IsOptional()
  healthInsuranceCode: string;

  @IsOptional()
  lifeInsuranceCode: string;

  @IsOptional({ message: 'Social Insurance Number must not be empty !' })
  @IsString()
  socialInsuranceNumber: string;

  @IsOptional({
    message: 'Personal Tax Idenification Number must not be empty !',
  })
  @IsString()
  personalTaxIdentificationNumber: string;

  @IsOptional({ message: 'Bank Account must not be empty !' })
  @IsString()
  backAccountNumber: string;
}

export class UpdateWorkingHoursDto {
  @IsNotEmpty()
  @IsNumber()
  workingHours: number;
}
