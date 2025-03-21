import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { IUser } from './users.interface';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { SecurityService } from 'src/security/security.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: SoftDeleteModel<UserDocument>,
    private configService: ConfigService,
    private blockchainService: BlockchainService,
    private securityService: SecurityService,
  ) {}

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash;
  };

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  getUserByToken = async (refreshToken: string) => {
    try {
      return await this.userModel.findOne({ refreshToken });
    } catch (error) {
      console.log(error);
    }
  };

  updateUserToken = async (refreshToken: string, _id: string) => {
    try {
      return await this.userModel
        .updateOne(
          { _id },
          {
            refreshToken,
          },
        )
        .populate({
          path: 'role',
          select: { name: 1 },
        });
    } catch (error) {
      console.log(error);
    }
  };
  //func write sensitive data user to blockchain

  findOneByUsername(username: string) {
    return this.userModel
      .findOne({
        email: username,
      })
      .populate({ path: 'role', select: { name: 1 } });
  }
  PRIVATE_FIELDS = [
    'personalIdentificationNumber',
    'position',
    'department',
    'employeeContractId',
    'startDate',
    'terminationDate',
    'personalTaxIdentificationNumber',
    'socialInsuranceNumber',
    'backAccountNumber',
  ];
  splitData(updateUserDto: UpdateUserDto) {
    const publicData: Record<string, any> = {};
    const privateData: Record<string, any> = {};
    let employeeId: string;
    for (const [key, value] of Object.entries(updateUserDto)) {
      if (this.PRIVATE_FIELDS.includes(key)) {
        privateData[key] = value;
      } else {
        publicData[key] = value;
      }
      if (key === 'employeeId') {
        employeeId = value;
      }
    }
    return { employeeId, privateData, publicData };
  }
  async create(createUserDto: CreateUserDto, user: IUser) {
    try {
      const { name, email, password, role } = createUserDto;
      const isExist = await this.userModel.findOne({ email });
      if (isExist) {
        throw new BadRequestException(
          'Email already exist. Please use another email',
        );
      }

      const hashPassword = this.getHashPassword(password);
      let newUser = await this.userModel.create({
        name,
        email,
        password: hashPassword,
        employeeId: createUserDto.employeeId,
        role: role?._id,
        createdBy: {
          _id: user._id,
          email: user.email,
        },
      });

      const employeeData = {
        employeeId: createUserDto.employeeId,
        encryptedData: this.securityService.encrypt({
          personalIdentificationNumber:
            createUserDto.personalIdentificationNumber,
          position: createUserDto.positionId,
          department: createUserDto.departmentId,
          employeeContractId: createUserDto.employeeContractId,
          startDate: createUserDto.startDate,
          terminationDate: createUserDto.terminationDate,
          personalTaxIdentificationNumber:
            createUserDto.personalTaxIdentificationNumber,
          socialInsuranceNumber: createUserDto.socialInsuranceNumber,
          backAccountNumber: createUserDto.backAccountNumber,
          // Don't save password information
        }),
      };
      console.log(employeeData);
      try {
        const txHash = await this.blockchainService.addEmployee(employeeData);
        console.log(txHash);
        return {
          ...createUserDto,
          blockchainTxHash: txHash,
        };
      } catch (error) {
        throw error;
      }
      // return newUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.userModel
      .find(filter)
      .select('-password')
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    const employees = await this.blockchainService.getAllEmployeeIds();
    console.log(employees);
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid user ID`);
    }

    return await this.userModel
      .findOne({
        _id: id,
        isDeleted: false,
      })
      .select('-password -refreshToken')
      .populate({ path: 'role', select: { name: 1, _id: 1 } });
  }

  async findPrivateOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid user ID`);
    }
    const publicEmployee = await this.userModel
      .findById(id)
      .select('-password -refreshToken')
      .populate({ path: 'role', select: { name: 1, _id: 1 } })
      .lean();
    const privateEmployee = await this.blockchainService.getEmployee(
      publicEmployee.employeeId,
    );

    return {
      ...publicEmployee,
      ...privateEmployee,
    };
  }
  // }
  async update(updateUserDto: UpdateUserDto, user: IUser, id: string) {
    //validate
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid user ID`);
    }
    const idExist = await this.userModel.findOne({
      _id: id,
    });
    if (!idExist) throw new BadRequestException('User not found !');

    //update in blockchain
    let txHash: string;
    const { employeeId, privateData, publicData } =
      this.splitData(updateUserDto);
    if (Object.keys(privateData).length !== 0) {
      if (!employeeId) {
        throw new BadRequestException(
          'Can not update. Must have employee ID !',
        );
      }
      const updateData = {
        employeeId: employeeId,
        encryptedData: this.securityService.encrypt(privateData),
      };
      try {
        txHash = await this.blockchainService.updateEmployee(updateData);
        console.log(txHash);
      } catch (error) {
        throw error;
      }
    }

    return await this.userModel.updateOne(
      {
        _id: id,
      },
      {
        ...publicData,
        txHash,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid user ID`);
    }

    const foundUser = await this.userModel.findById(id);
    const ADMIN_EMAIL = this.configService.get<string>('ADMIN_EMAIL');

    if (foundUser && foundUser.email === ADMIN_EMAIL)
      throw new BadRequestException('Cannot delete admin account !');

    await this.userModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    const employee = await this.userModel
      .findOne({ _id: id })
      .select('employeeId');
    console.log(employee);
    await this.blockchainService.deactivateEmployee(employee.employeeId);

    return this.userModel.softDelete({
      _id: id,
    });
  }
}
