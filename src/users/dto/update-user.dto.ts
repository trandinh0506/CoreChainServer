import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}
