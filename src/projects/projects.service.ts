import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { TasksService } from 'src/tasks/tasks.service';
import { IProject } from './project.interface';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: SoftDeleteModel<ProjectDocument>,
    private taskService: TasksService,
  ) {}
  async progressCalculation(id: string) {
    const taskCompleted = await this.taskService.countTask(3, id);
    const taskAmount = await this.taskService.countTask(0, id);
    console.log(taskCompleted, taskAmount);
    return (taskCompleted / taskAmount) * 100;
  }
  async create(createProjectDto: CreateProjectDto, user: IUser) {
    const {
      name,
      description,
      attachments = [],
      teamMembers,
      tasks = [],
      expenses = [],
      revenue,
      priority,
      status,
      startDate,
      endDate,
      actualEndDate,
    } = createProjectDto;
    //calculate progess
    const newProject = await this.projectModel.create({
      name,
      description,
      attachments,
      teamMembers,
      tasks,
      expenses,
      revenue,
      priority,
      status,
      startDate,
      endDate,
      actualEndDate,
    });
    return newProject._id;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    let { filter, skip, sort, projection, population = [] } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.projectModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);
    population.push({ path: 'tasks', select: 'name' });
    population.push({ path: 'manager', select: 'name email' });
    // population.push({ path: 'teamMembers', select: 'name email' });
    const projects: IProject[] = await this.projectModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    const projectIds = projects.map((p) => p._id);

    const taskCompletedCounts = await Promise.all(
      projectIds.map((id) => this.taskService.countTask(3, id.toString())),
    );
    const taskTotalCounts = await Promise.all(
      projectIds.map((id) => this.taskService.countTask(0, id.toString())),
    );

    projects.forEach((project, index) => {
      const taskCompleted = taskCompletedCounts[index] || 0;
      const taskTotal = taskTotalCounts[index] || 1;
      project.progress = (taskCompleted / taskTotal) * 100;
    });

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      projects,
    };
  }
  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid project ID`);
    }
    const project: IProject = await this.projectModel
      .findOne({ _id: id })
      .populate([
        // { path: 'teamMembers', select: 'name email' },
        { path: 'manager', select: 'name email' },
      ])
      .lean();
    project.progress = await this.progressCalculation(id);
    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid project ID`);
    }

    const progress = await this.progressCalculation(id);
    return this.projectModel.updateOne(
      { _id: id },
      {
        progress: progress,
        ...updateProjectDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid project ID`);
    }
    await this.projectModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.projectModel.softDelete({ _id: id });
  }
}
