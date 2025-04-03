import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import aqp from 'api-query-params';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/users.interface';
import mongoose, { ObjectId } from 'mongoose';
import { END_OF_MONTH, START_OF_MONTH } from 'src/decorators/customize';
// import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: SoftDeleteModel<TaskDocument>,
    // private projectService: ProjectsService,
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
    return newTask._id;
  }

  async countTask(status: number, id: string) {
    if (status === 0) {
      return this.taskModel.countDocuments({
        projectId: new mongoose.Types.ObjectId(id),
      });
    }
    return this.taskModel.countDocuments({
      status,
      projectId: new mongoose.Types.ObjectId(id),
    });
  }

  async countTaskInMonth(status: number, id: string) {
    if (status === 0) {
      return await this.taskModel.countDocuments({
        assignedTo: id,
        createdAt: { $gte: START_OF_MONTH, $lte: END_OF_MONTH },
      });
    }
    return await this.taskModel.countDocuments({
      assignedTo: id,
      status,
      createdAt: { $gte: START_OF_MONTH, $lte: END_OF_MONTH },
    });
  }
  async findAll(currentPage: number, limit: number, qs: string) {
    let { filter, skip, sort, projection, population = [] } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.taskModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result = await this.taskModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();
    //find project and add project.name to task
    // const projectIds = result
    //   .map((task) => task.projectId?.toString())
    //   .filter(Boolean);

    // const projects = await Promise.all(
    //   projectIds.map((id) => this.projectService.findOne(id)),
    // );

    // const projectMap = new Map(
    //   projects.map((project) => [project._id.toString(), project.name]),
    // );

    // const tasksWithProjectName = result.map((task) => ({
    //   ...task.toObject(),
    //   projectName: projectMap.get(task.projectId?.toString()) || null,
    // }));
    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      // result: tasksWithProjectName,
      result,
    };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid task ID`);
    }
    const task = await this.taskModel.findOne({ _id: id }).lean();
    // const project = await this.projectService.findOne(
    //   task.projectId.toString(),
    // );
    return {
      ...task,
      // projectName: project.name,
    };
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
