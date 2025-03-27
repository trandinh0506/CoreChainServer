import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SalaryAdvanceDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  returnDate: Date;
}
