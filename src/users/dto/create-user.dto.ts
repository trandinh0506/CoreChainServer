import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';


export class AdjustmentDto {
  @IsNumber()
  amount: number;

  @IsString()
  reason: string;

  @IsOptional()
  createdAt?: Date;
}

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

  @IsOptional({ message: 'Working hours must not be empty !' })
  @Transform(({ value }) => (value === undefined ? 0 : value))
  @IsNumber({}, { message: 'Working hours must be number !' })
  workingHours: number;

  @IsNotEmpty({ message: 'Employee ID must not be empty !' })
  @IsString()
  employeeId: string;

  @IsNotEmpty()
  @IsMongoId()
  position: string;

  @IsNotEmpty({ message: 'Department must not be empty !' })
  @IsMongoId()
  department: string;

  @IsOptional()
  @IsNumber()
  netSalary: number;

  @IsOptional()
  avatar: string;

  @IsOptional({ message: 'Personal Identificaion Number must not be empty !' })
  @IsString()
  personalIdentificationNumber: string;

  @IsOptional()
  dateOfBirth: Date;

  @IsOptional()
  personalPhoneNumber: string;

  @IsOptional()
  male: boolean;

  @IsOptional()
  nationality: string;

  @IsOptional()
  permanentAddress: string;

  @IsOptional()
  biometricData: string;

  @IsOptional()
  @IsMongoId()
  employeeContractCode: string;

  @IsOptional()
  @IsNumber()
  salary: number;

  @IsOptional()
  @IsNumber()
  allowances: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdjustmentDto)
  adjustments: AdjustmentDto[];

  @IsOptional()
  @IsNumber()
  loansSupported: number;

  @IsOptional()
  healthCheckRecordCode: string[];

  @IsOptional()
  medicalHistory: string;

  @IsOptional()
  healthInsuranceCode: string;

  @IsOptional()
  lifeInsuranceCode: string;

  @IsOptional({ message: 'Social Insurance Number must not be empty !' })
  @IsString()
  socialInsuranceNumber: string;

  @IsOptional({
    message: 'Personal Tax Idenification Number must not be empty !',
  })
  
  @IsString()
  personalTaxIdentificationNumber: string;

  @IsOptional({ message: 'Bank Account must not be empty !' })
  @IsString()
  backAccountNumber: string;
}
