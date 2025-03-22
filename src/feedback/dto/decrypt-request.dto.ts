import { IsNotEmpty } from 'class-validator';

export class DecryptRequestDto {
  @IsNotEmpty()
  reason: string;
  @IsNotEmpty()
  approvedBy: string;
  @IsNotEmpty()
  secretKey: string;
}
