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

export class CreatePositionDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsMongoId()
  parentId: string;

  @IsNotEmpty()
  @IsNumber()
  level: number;
}
