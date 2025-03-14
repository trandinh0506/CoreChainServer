import { Transform } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name must not be empty !' })
  name: string;

  @IsEmail({}, { message: 'Email is invalid !' })
  @IsNotEmpty({ message: 'Email must not be empty !' })
  email: string;

  @IsNotEmpty({ message: 'Password must not be empty !' })
  password: string;

  @IsNotEmpty({ message: 'Role must not be empty !' })
  role: string;

  @Transform(({ value }) => (value === undefined ? null : value))
  // @IsNotEmpty({ message: 'Wallet Address must not be empty !' })
  walletAddress: string;

  @Transform(({ value }) => (value === undefined ? 0 : value))
  // @IsNumber({}, { message: 'Working hours must be number !' })
  workingHours: number;
}
