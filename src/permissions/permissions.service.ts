import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from './entities/permission.entity';
import { IPermission } from './permission.interface';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
  ) {}

  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { name, apiPath, method, module } = createPermissionDto;
    const existPer = await this.permissionRepository.findOne({
      where: { apiPath, method },
    });
    if (existPer)
      throw new BadRequestException('This permission already exist !');

    const newPermission = this.permissionRepository.create({
      name,
      apiPath,
      method,
      module,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    const saved = await this.permissionRepository.save(newPermission);
    return saved._id;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    let offset = (+currentPage - 1) * (+limit || 10);
    let defaultLimit = +limit || 10;

    const [result, totalItems] = await this.permissionRepository.findAndCount({
      skip: offset,
      take: defaultLimit,
      // order: { createdAt: 'DESC' }
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

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
    const permission = await this.permissionRepository.findOne({ where: { _id: id } });
    if (!permission) {
      throw new BadRequestException(`Not found permission with id=${id}`);
    }
    return permission as unknown as IPermission;
  }

  async update(id: string, updatePermissionDto: UpdatePermissionDto, user: IUser) {
    const permission = await this.permissionRepository.findOne({ where: { _id: id } });
    if (!permission) {
      throw new BadRequestException(`Not found permission with id=${id}`);
    }

    Object.assign(permission, {
      ...updatePermissionDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return await this.permissionRepository.save(permission);
  }

  async remove(id: string, user: IUser) {
    const permission = await this.permissionRepository.findOne({ where: { _id: id } });
    if (!permission) {
      throw new BadRequestException(`Not found permission with id=${id}`);
    }
    permission.deletedBy = {
      _id: user._id,
      email: user.email,
    };
    permission.isDeleted = true;
    await this.permissionRepository.save(permission);
    return await this.permissionRepository.softDelete({ _id: id });
  }
}
