import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePassword, UpdatePublicUserDto, UpdateUserDto, UpdateWorkingHoursDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { CompleteUser, IUser, PrivateUser, PublicUser } from './users.interface';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { SecurityService } from 'src/security/security.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { System } from 'src/decorators/customize';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private dataSource: DataSource,
    private configService: ConfigService,
    private blockchainService: BlockchainService,
    private securityService: SecurityService,
    private departmentService: DepartmentsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  isValidId(id: string) {
    return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    return hashSync(password, salt);
  };

  isValidPassword(password: string, hashPassword: string) {
    return compareSync(password, hashPassword);
  }

  getUserByToken = async (refreshToken: string) => {
    try {
      return await this.userRepository.findOne({ where: { refreshToken } });
    } catch (error) {
      console.log(error);
    }
  };

  updateUserToken = async (refreshToken: string, _id: string) => {
    try {
      await this.userRepository.update(_id, { refreshToken });
      return await this.userRepository.findOne({ where: { _id }, relations: ['role'] });
    } catch (error) {
      console.log(error);
    }
  };

  findOneByUsername(username: string) {
    return this.userRepository.findOne({
      where: { email: username, isDeleted: false },
      relations: ['role'],
    });
  }

  PRIVATE_FIELDS = [
    'netSalary', 'personalIdentificationNumber', 'dateOfBirth', 'personalPhoneNumber',
    'male', 'nationality', 'permanentAddress', 'biometricData', 'employeeContractCode',
    'salary', 'allowances', 'adjustments', 'healthCheckRecordCode', 'medicalHistory',
    'healthInsuranceCode', 'lifeInsuranceCode', 'personalTaxIdentificationNumber',
    'socialInsuranceNumber', 'backAccountNumber',
  ];

  splitData(updateUserDto: UpdateUserDto | CreateUserDto) {
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

  async setCached(id: string, data: unknown) {
    await this.cacheManager.set(`employee:${id}`, data);
  }

  async getCached(id: string) {
    return (await this.cacheManager.get(`employee:${id}`)) as CompleteUser;
  }

  async delCached(id: string) {
    await this.cacheManager.del(`employee:${id}`);
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const isExist = await queryRunner.manager.findOne(User, { where: { email: createUserDto.email } });
      if (isExist) throw new BadRequestException('Email already exists');

      const hashPassword = this.getHashPassword(createUserDto.password);
      const { employeeId, privateData, publicData } = this.splitData(createUserDto);

      const newUser = queryRunner.manager.create(User, {
        ...publicData,
        password: hashPassword,
        createdBy: { _id: user._id, email: user.email },
      });

      const savedUser = await queryRunner.manager.save(newUser);

      if (createUserDto.department) {
        const department = await this.departmentService.findOne(createUserDto.department.toString());
        if (department) {
          if (!department.employees) department.employees = [];
          department.employees.push(savedUser._id);
          await this.departmentService.update(
            department._id.toString(),
            { employees: department.employees },
            System,
          );
        }
      }
      // update blockchain
      try {
        const txHash = await this.blockchainService.addEmployee(privateData as any, employeeId);
        await queryRunner.manager.update(User, savedUser._id, { txHash });
      } catch (blockchainError: any) {
        throw new Error('Blockchain transaction failed: ' + blockchainError.message);
      }

      await queryRunner.commitTransaction();
      return savedUser._id;
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    let offset = (+currentPage - 1) * (+limit || 10);
    let defaultLimit = +limit || 10;

    const [result, totalItems] = await this.userRepository.findAndCount({
      skip: offset,
      take: defaultLimit,
      where: { isDeleted: false },
      relations: ['role', 'position', 'department'],
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result: result.map(u => {
        const { password, refreshToken, ...publicUser } = u;
        return publicUser;
      }),
    };
  }

  async findAllByIds(ids: string[]) {
    if (!ids || ids.length === 0) return [];

    const invalidIds = ids.filter((id) => !this.isValidId(id));
    if (invalidIds.length > 0) throw new BadRequestException(`Invalid user IDs: ${invalidIds.join(', ')}`);

    const users = await this.userRepository.createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .leftJoinAndSelect('user.position', 'position')
      .leftJoinAndSelect('user.department', 'department')
      .where('user._id IN (:...ids)', { ids })
      .andWhere('user.isDeleted = :isDeleted', { isDeleted: false })
      .getMany();

    return users.map(u => {
      const { password, refreshToken, ...publicUser } = u;
      return publicUser;
    });
  }

  async findOnePublic(id: string) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid user ID`);
    
    const user = await this.userRepository.findOne({
      where: { _id: id, isDeleted: false },
      select: ['_id', 'name', 'avatar'],
    });
    return user;
  }

  async findOne(id: string) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid user ID`);
    const user = await this.userRepository.findOne({
      where: { _id: id, isDeleted: false },
      relations: ['role', 'position', 'department'],
    });
    if (user) {
      const { password, refreshToken, ...publicUser } = user;
      return publicUser;
    }
    return null;
  }

  async findByIds(ids: string[]) {
    return this.findAllByIds(ids);
  }

  async findPrivateOne(id: string) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid user ID`);
    const cachedEmployee = await this.getCached(id);
    if (cachedEmployee) {
      Logger.log('Got employee from cache !');
      return cachedEmployee;
    } else {
      const publicEmployee = await this.findOne(id) as any;
      if (!publicEmployee) throw new BadRequestException('User not found');

      const privateEmployee = await this.blockchainService.getEmployee(publicEmployee.employeeId);
      const employee: CompleteUser = {
        ...publicEmployee,
        ...privateEmployee,
      };
      await this.setCached(id, employee);
      Logger.log('Cached This Employee');
      return employee;
    }
  }

  async update(updateUserDto: UpdateUserDto, user: IUser, id: string) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid user ID`);
    const idExist = await this.userRepository.findOne({ where: { _id: id } });
    if (!idExist) throw new BadRequestException('User not found !');

    if (idExist.employeeId !== updateUserDto.employeeId) {
      throw new BadRequestException('You cannot update employee ID !');
    }
    // blockchain update
    let txHash: string;
    const { employeeId, privateData, publicData } = this.splitData(updateUserDto);

    if (Object.keys(privateData).length !== 0) {
      if (!employeeId) throw new BadRequestException('Can not update. Must have employee ID !');
      try {
        txHash = await this.blockchainService.updateEmployee(privateData as any, employeeId);
      } catch (error) {
        throw error;
      }
    }

    // Role, Department, Position relations string mappings
    const relationsToUpdate: any = {};
    if (publicData.role) relationsToUpdate.role = { _id: publicData.role };
    if (publicData.department) relationsToUpdate.department = { _id: publicData.department };
    if (publicData.position) relationsToUpdate.position = { _id: publicData.position };

    Object.assign(idExist, {
      ...publicData,
      ...relationsToUpdate,
      txHash: txHash || idExist.txHash,
      updatedBy: { _id: user._id, email: user.email },
    });

    await this.userRepository.save(idExist);

    const cachedEmployee = await this.getCached(id);
    if (cachedEmployee) {
      await this.delCached(id);
    }
    return idExist;
  }

  async updateWorkingHours(updateWorkingHoursDto: UpdateWorkingHoursDto, user: IUser, id: string) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid user ID`);
    const idExist = await this.userRepository.findOne({ where: { _id: id } });
    if (!idExist) throw new BadRequestException('User not found !');

    idExist.workingHours += updateWorkingHoursDto.workingHours;
    idExist.updatedBy = { _id: user._id, email: user.email };
    return await this.userRepository.save(idExist);
  }

  async updatePublicUser(updatePublicUserDto: UpdatePublicUserDto, user: IUser, id: string) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid user ID`);
    const idExist = await this.userRepository.findOne({ where: { _id: id } });
    if (!idExist) throw new BadRequestException('User not found !');
    
    if (updatePublicUserDto.email) {
      const emailExist = await this.userRepository.findOne({ where: { email: updatePublicUserDto.email } });
      if (emailExist && emailExist._id !== id) throw new BadRequestException('Email already exist !');
    }

    // Note: simplified department update logic for brevity
    const relationsToUpdate: any = {};
    if (updatePublicUserDto.department) relationsToUpdate.department = { _id: updatePublicUserDto.department };

    Object.assign(idExist, {
      ...updatePublicUserDto,
      ...relationsToUpdate,
      updatedBy: { _id: user._id, email: user.email },
    });
    
    return await this.userRepository.save(idExist);
  }

  async updateFcmToken(userId: string, fcmToken: string) {
    if (!this.isValidId(userId)) throw new BadRequestException(`Invalid user ID`);
    const user = await this.userRepository.findOne({ where: { _id: userId } });
    if (!user) throw new BadRequestException('User not found');

    user.fcmToken = fcmToken;
    await this.userRepository.save(user);

    return { message: 'FCM token updated successfully', userId: userId };
  }

  async changePassword(updatePassword: UpdatePassword, thisUser: IUser) {
    const { id, oldPassword, newPassword } = updatePassword;
    const user = await this.userRepository.findOne({ where: { _id: id } });
    
    if (thisUser._id !== user?._id) throw new BadRequestException('You only change your password !');
    if (!user) throw new BadRequestException('User Not Found !');
    
    if (!this.isValidPassword(oldPassword, user.password || '')) {
      throw new BadRequestException('Password is Incorrect !');
    }

    user.password = this.getHashPassword(newPassword);
    await this.userRepository.save(user);
    return 'Update Password Successfully !';
  }

  async remove(id: string, user: IUser) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid user ID`);
    const foundUser = await this.userRepository.findOne({ where: { _id: id } });
    if (!foundUser) throw new BadRequestException('User not found');

    const ADMIN_EMAIL = this.configService.get<string>('ADMIN_EMAIL');
    if (foundUser.email === ADMIN_EMAIL) throw new BadRequestException('Cannot delete admin account !');

    foundUser.deletedBy = { _id: user._id, email: user.email };
    foundUser.isDeleted = true;
    foundUser.deletedAt = new Date();
    
    await this.userRepository.save(foundUser);
    
    try {
      await this.blockchainService.deactivateEmployee(foundUser.employeeId);
    } catch (e) {
      Logger.error(e);
    }
    return foundUser;
  }
}
