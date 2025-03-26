import { PartialType } from '@nestjs/mapped-types';
import { CreatePersonnelDto } from './create-personnel.dto';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
class AdjustmentDto {
  @IsNumber()
  amount: number;

  @IsString()
  reason: string;
}
export class UpdatePersonnelDto extends PartialType(CreatePersonnelDto) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AdjustmentDto)
  adjustment: AdjustmentDto;
}
