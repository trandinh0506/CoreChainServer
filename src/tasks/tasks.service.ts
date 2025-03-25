import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: SoftDeleteModel<TaskDocument>,
  ) {}
  async create(createTaskDto: CreateTaskDto, user: IUser) {
    const {
      name,
      description,
      title,
      attachments = [],
      assignedTo,
      projectId,
      priority,
      status,
      startDate,
      dueDate,
    } = createTaskDto;
    const newTask = await this.taskModel.create({
      createdBy: {
        _id: user._id,
        email: user.email,
      },
      name,
      title,
      description,
      attachments,
      assignedTo,
      projectId,
      priority,
      status,
      startDate,
      dueDate,
    });
    return newTask;
  }
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.taskModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.taskModel
      .find(filter)
      .select('-password')
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
      throw new BadRequestException(`Invalid task ID`);
    }
    return this.taskModel.findById(id);
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid task ID`);
    }

    return this.taskModel.updateOne(
      { _id: id },
      {
        ...updateTaskDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid task ID`);
    }
    await this.taskModel.updateOne(
      {
        _id: id,
      },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.taskModel.softDelete({ _id: id });
  }
}
