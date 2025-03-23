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

export class CreateContractDto {
  @IsNotEmpty()
  contractCode: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  file: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  @IsMongoId()
  employee: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  salary: number;

  @IsNotEmpty()
  @IsNumber()
  allowances: number;

  @IsNotEmpty()
  insurance: string;

  @IsNotEmpty()
  @IsNumber()
  workingHours: number;

  @IsNotEmpty()
  leavePolicy: string;

  @IsNotEmpty()
  terminationTerms: string;

  @IsNotEmpty()
  confidentialityClause: string;
}
