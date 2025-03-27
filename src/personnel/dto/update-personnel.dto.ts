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
import { AdjustmentDto } from 'src/users/dto/update-user.dto';

export class UpdatePersonnelDto extends PartialType(CreatePersonnelDto) {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AdjustmentDto)
  adjustment: AdjustmentDto;
}
