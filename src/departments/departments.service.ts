import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './entities/department.entity';
import { IDepartment } from './department.interface';
import aqp from 'api-query-params';
import { aqpTypeormConverter } from 'src/utils/aqp.util';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  isValidId(id: string) {
    return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  async create(createDepartmentDto: CreateDepartmentDto, user: IUser) {
    const isExist = await this.departmentRepository.findOne({
      where: { code: createDepartmentDto.code },
    });
    if (isExist) {
      throw new BadRequestException('Department already exist !');
    }
    const newDepartment = this.departmentRepository.create({
      ...createDepartmentDto,
      employees: [],
      projectIds: [],
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    const saved = await this.departmentRepository.save(newDepartment);
    return saved._id;
  }

  async findAll(query: any) {
    const { filter, skip, limit, sort } = aqp(query);
    const convertedFilter = aqpTypeormConverter(filter);

    let defaultLimit = limit || 10;
    let offset = skip || 0;
    const currentPage = Math.floor(offset / defaultLimit) + 1;

    const [result, totalItems] = await this.departmentRepository.findAndCount({
      skip: offset,
      take: defaultLimit,
      where: { isDeleted: false, ...convertedFilter },
      order: sort as any,
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result: result as unknown as IDepartment[],
    };
  }

  async findOne(id: string) {
    if (!this.isValidId(id)) {
      throw new BadRequestException(`Invalid department ID`);
    }
    return (await this.departmentRepository.findOne({ where: { _id: id } })) as unknown as IDepartment;
  }

  async update(id: string, updateDepartmentDto: any, user?: IUser) {
    if (!this.isValidId(id)) {
      throw new BadRequestException(`Invalid department ID`);
    }
    
    // In service it can be called internally by system
    const updateData: any = user 
      ? {
          ...updateDepartmentDto,
          updatedBy: {
            _id: user._id,
            email: user.email,
          },
        }
      : updateDepartmentDto;
    
    await this.departmentRepository.update(id, updateData);
    return;
  }

  async remove(id: string, user: IUser) {
    if (!this.isValidId(id)) {
      throw new BadRequestException(`Invalid department ID`);
    }

    const dept = await this.departmentRepository.findOne({ where: { _id: id } });
    if (!dept) throw new BadRequestException(`Invalid department ID`);

    dept.updatedBy = { _id: user._id, email: user.email };
    dept.deletedAt = new Date();
    dept.isDeleted = true;
    await this.departmentRepository.save(dept);
    
    return this.departmentRepository.softDelete(id);
  }
}
