import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

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

export class UpdatePassword {
  @IsMongoId()
  @IsNotEmpty()
  id: mongoose.Schema.Types.ObjectId;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
