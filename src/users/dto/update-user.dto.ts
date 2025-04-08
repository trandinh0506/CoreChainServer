import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEmpty,
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
  @IsNumber()
  netSalary: number;

  @IsOptional()
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

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdjustmentDto)
  adjustments: AdjustmentDto[];

  @IsNotEmpty()
  @IsNumber()
  loansSupported: number;

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

export class UpdateWorkingHoursDto {
  @IsNotEmpty()
  @IsNumber()
  workingHours: number;
}

export class UpdatePublicUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsNumber()
  kpi?: number;

  @IsOptional()
  @IsNumber()
  dayOff?: number;
}
