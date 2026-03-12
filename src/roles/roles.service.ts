import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { IUser } from 'src/users/users.interface';
import { ADMIN_ROLE } from 'src/decorators/customize';
import { IRole } from './role.interface';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const { name, description, isActive, permissions } = createRoleDto;
    const existRole = await this.roleRepository.findOne({ where: { name } });
    if (existRole) {
      throw new BadRequestException('This role already exist !');
    }
    
    const permissionEntities = permissions?.map((id) => ({ _id: id as unknown as string })) || [];
    
    const newRole = this.roleRepository.create({
      name,
      description,
      isActive,
      permissions: permissionEntities as any,
    });
    const saved = await this.roleRepository.save(newRole);
    return saved._id;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    let offset = (+currentPage - 1) * (+limit || 10);
    let defaultLimit = +limit || 10;

    const [result, totalItems] = await this.roleRepository.findAndCount({
      skip: offset,
      take: defaultLimit,
      relations: ['permissions'],
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
    const role = await this.roleRepository.findOne({
      where: { _id: id },
      relations: ['permissions'],
    });
    if (!role) {
      throw new BadRequestException(`Not found role with id=${id}`);
    }
    return role as unknown as IRole;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto, user: IUser) {
    const role = await this.roleRepository.findOne({ where: { _id: id } });
    if (!role) {
      throw new BadRequestException(`Not found role with id=${id}`);
    }

    const { permissions, ...rest } = updateRoleDto;
    if (permissions) {
      role.permissions = permissions.map((pId) => ({ _id: pId as unknown as string })) as any;
    }

    Object.assign(role, {
      ...rest,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return await this.roleRepository.save(role);
  }

  async remove(id: string, user: IUser) {
    const foundRole = await this.roleRepository.findOne({ where: { _id: id } });
    if (!foundRole) {
      throw new BadRequestException(`Not found role with id=${id}`);
    }
    if (foundRole.name === ADMIN_ROLE)
      throw new BadRequestException('Cannot delete admin role !');

    foundRole.deletedBy = {
      _id: user._id,
      email: user.email,
    };
    foundRole.isDeleted = true;
    await this.roleRepository.save(foundRole);
    return await this.roleRepository.softDelete({ _id: id });
  }
}
