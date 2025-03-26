import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import mongoose from 'mongoose';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private departmentModel: SoftDeleteModel<DepartmentDocument>,
  ) {}

  async create(createDepartmentDto: CreateDepartmentDto, user: IUser) {
    const { name, code, description, manager, status, budget, projectIds } =
      createDepartmentDto;
    const isExist = await this.departmentModel.findOne({ code: code });
    if (isExist) {
      throw new BadRequestException('Department already exist !');
    }
    const newDepartment = await this.departmentModel.create({
      name,
      code,
      description,
      manager,
      status,
      budget,
      projectIds,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newDepartment;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    let { filter, skip, sort, projection, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.departmentModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    // population.push({ path: 'manager', select: '_id name email' });
    // population.push({ path: 'employees', select: '_id name email' });
    const result = await this.departmentModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

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
      throw new BadRequestException(`Invalid department ID`);
    }
    return (
      this.departmentModel
        .findById(id)
        // .populate([
        //   { path: 'manager', select: '_id name email' },
        //   { path: 'employees', select: '_id name email' },
        // ])
        .exec()
    );
  }

  async update(
    id: string,
    updateDepartmentDto: UpdateDepartmentDto,
    user: IUser,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid department ID`);
    }
    return this.departmentModel.updateOne(
      { _id: id },
      {
        ...updateDepartmentDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid department ID`);
    }
    await this.departmentModel.updateOne(
      { _id: id },
      {
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.departmentModel.softDelete({ _id: id });
  }
}
