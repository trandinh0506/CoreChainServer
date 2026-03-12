import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { IUser } from 'src/users/users.interface';
import { START_OF_MONTH, END_OF_MONTH } from 'src/decorators/customize';
import { ITask } from './task.interface';
import { NotificationService } from 'src/notification/notification.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private notificationService: NotificationService,
    private usersService: UsersService,
  ) {}

  isValidId(id: string) {
    return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  async create(createTaskDto: CreateTaskDto, user: IUser) {
    const {
      description, title, attachments = [], assignedTo,
      projectId, priority, status, startDate, dueDate,
    } = createTaskDto as any;

    if (startDate && dueDate && new Date(startDate) > new Date(dueDate)) {
      throw new BadRequestException('Start date must be before due date');
    }

    const newTask = this.taskRepository.create({
      title, description, attachments, priority, status, startDate, dueDate,
      projectId: projectId?.toString(),
      assignedTo: assignedTo ? { _id: assignedTo.toString() } as any : null,
      createdBy: { _id: user._id, email: user.email },
    });

    const saved = await this.taskRepository.save(newTask);

    this.publishTaskCreatedEvent(saved, user).catch(error => {
      console.error('Failed to publish task.created event:', error);
    });

    return saved._id;
  }

  private async publishTaskCreatedEvent(task: any, creator: IUser) {
    try {
      if (!task.assignedTo || !task.assignedTo._id) return;
      const assignedUser = await this.usersService.findOne(task.assignedTo._id) as any;
      if (!assignedUser) return;

      const event = {
        event_type: 'task.created',
        timestamp: new Date().toISOString(),
        data: {
          _id: task._id.toString(),
          title: task.title,
          description: task.description,
          attachments: task.attachments,
          createdBy: creator,
          assignedTo: task.assignedTo._id.toString(),
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

      await this.notificationService.publishTaskCreated(event);
    } catch (error) {
      console.error('Error in publishTaskCreatedEvent:', error);
      throw error;
    }
  }

  async countTask(status: number, id: string) {
    if (status === 0) {
      return this.taskRepository.count({ where: { projectId: id } });
    }
    return this.taskRepository.count({ where: { status, projectId: id } });
  }

  async countTaskInMonth(status: number, id: string) {
    const qb = this.taskRepository.createQueryBuilder('task')
        .where('task.assignedToId = :id', { id }) 
        .andWhere('task.createdAt >= :start AND task.createdAt <= :end', { start: START_OF_MONTH, end: END_OF_MONTH });
    if (status !== 0) qb.andWhere('task.status = :status', { status });
    return qb.getCount();
  }

  async findAll(currentPage: number, limit: number, startDate: string, dueDate: string, qs: string) {
    let offset = (+currentPage - 1) * (+limit || 10);
    let defaultLimit = +limit || 10;

    const [result, totalItems] = await this.taskRepository.findAndCount({
      skip: offset,
      take: defaultLimit,
      where: { isDeleted: false },
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
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid task ID`);
    return await this.taskRepository.findOne({ where: { _id: id } }) as unknown as ITask;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, user: IUser) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid task ID`);
    const task = await this.taskRepository.findOne({ where: { _id: id } });
    if (!task) throw new BadRequestException(`Invalid task ID`);

    const { assignedTo, projectId, ...rest } = updateTaskDto as any;
    if (assignedTo) task.assignedTo = { _id: assignedTo.toString() } as any;
    if (projectId) task.projectId = projectId.toString();

    Object.assign(task, {
      ...rest,
      updatedBy: { _id: user._id, email: user.email },
    });

    return await this.taskRepository.save(task);
  }

  async remove(id: string, user: IUser) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid task ID`);
    const task = await this.taskRepository.findOne({ where: { _id: id } });
    if (!task) throw new BadRequestException(`Invalid task ID`);

    task.deletedBy = { _id: user._id, email: user.email };
    task.isDeleted = true;
    task.deletedAt = new Date();
    await this.taskRepository.save(task);

    return this.taskRepository.softDelete({ _id: id });
  }
}
