import { Transform } from 'class-transformer';
import { IsEmail, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';
import mongoose from 'mongoose';

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
  //permissions: [string]
  @Transform(({ value }) => (value === undefined ? 0 : value))
  // @IsNumber({}, { message: 'Working hours must be number !' })
  workingHours: number;

  employeeId: string;
  personalIdentificationNumber: string;

  position: mongoose.Schema.Types.ObjectId;
  department: mongoose.Schema.Types.ObjectId;

  employeeContractId: mongoose.Schema.Types.ObjectId;
  startDate: Date;
  terminationDate: Date;

  personalTaxIdentificationNumber: string;
  socialInsuranceNumber: string;

  backAccountNumber: string;
}
