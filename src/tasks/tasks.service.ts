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
import { ITask } from './task.interface';
import { NotificationService } from 'src/notification/notification.service';
import { UsersService } from 'src/users/users.service';
// import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: SoftDeleteModel<TaskDocument>,
    private notificationService: NotificationService,
    private usersService: UsersService,
    // private projectService: ProjectsService,
  ) {}
  async create(createTaskDto: CreateTaskDto, user: IUser) {
    const {
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

    // Validate that startDate is before dueDate
    if (startDate && dueDate) {
      const start = new Date(startDate);
      const due = new Date(dueDate);
      
      if (start > due) {
        throw new BadRequestException('Start date must be before due date');
      }
    }

    const newTask = await this.taskModel.create({
      createdBy: {
        _id: user._id,
        email: user.email,
      },
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

    // Publish task.created event to Kafka (fire-and-forget)
    this.publishTaskCreatedEvent(newTask, user).catch((error) => {
      // Log error but don't fail task creation
      console.error('Failed to publish task.created event:', error);
    });

    return newTask._id;
  }

  private async publishTaskCreatedEvent(task: any, creator: IUser) {
    try {
      // Fetch assigned user details including FCM token
      const assignedUser = await this.usersService.findOne(
        task.assignedTo.toString(),
      );

      if (!assignedUser) {
        console.warn(`Assigned user not found: ${task.assignedTo}`);
        return;
      }

      // Prepare task.created event
      const event = {
        event_type: 'task.created',
        timestamp: new Date().toISOString(),
        data: {
          _id: task._id.toString(),
          title: task.title,
          description: task.description,
          attachments: task.attachments,
          createdBy: {
            _id: creator._id.toString(),
            email: creator.email,
          },
          assignedTo: task.assignedTo.toString(),
          projectId: task.projectId?.toString(),
          priority: task.priority,
          status: task.status,
          startDate: task.startDate,
          dueDate: task.dueDate,
          isDeleted: task.isDeleted || false,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        },
        metadata: {
          assignedToUser: {
            _id: assignedUser._id.toString(),
            fcmToken: assignedUser.fcmToken || '',
            name: assignedUser.name || '',
            email: assignedUser.email,
          },
        },
      };

      // Publish to Kafka
      await this.notificationService.publishTaskCreated(event);
    } catch (error) {
      console.error('Error in publishTaskCreatedEvent:', error);
      throw error;
    }
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
  async findAll(currentPage: number, limit: number, startDate: string, dueDate: string, qs: string) {
    let { filter, skip, sort, projection, population = [] } = aqp(qs);
    console.log(filter);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    if (startDate) {
      filter.startDate = { $gte: startDate };
    }
    if (dueDate) {
      filter.dueDate = { $lte: dueDate };
    }

    const totalItems = await this.taskModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);
    const result: ITask[] = await this.taskModel
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
    //   ...task,
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
    const task: ITask = await this.taskModel.findOne({ _id: id }).lean();

    return task;
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
