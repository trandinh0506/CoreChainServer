import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { TasksService } from 'src/tasks/tasks.service';
import { IProject } from './project.interface';
import { DepartmentsService } from 'src/departments/departments.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
    private taskService: TasksService,
    private departmentService: DepartmentsService,
  ) {}

  isValidId(id: string) {
    return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  async progressCalculation(id: string) {
    const taskCompleted = await this.taskService.countTask(3, id);
    const taskAmount = await this.taskService.countTask(0, id);
    if (!taskAmount) return 0;
    return (taskCompleted / taskAmount) * 100;
  }

  async create(createProjectDto: CreateProjectDto, user: IUser) {
    const {
      name, description, department, manager, attachments = [],
      teamMembers = [], tasks = [], expenses = [], revenue,
      priority, status, startDate, endDate, actualEndDate,
    } = createProjectDto;

    const newProject = this.projectRepository.create({
      name, description, attachments, expenses, revenue,
      priority, status, startDate, endDate, actualEndDate,
      department: department ? { _id: department.toString() } as any : null,
      manager: manager ? { _id: manager.toString() } as any : null,
      teamMembers: teamMembers.map((id) => ({ _id: id.toString() })) as any,
      tasks: tasks.map((id) => ({ _id: id.toString() })) as any,
      createdBy: { _id: user._id, email: user.email },
    });

    const saved = await this.projectRepository.save(newProject);

    if (department) {
      const dept = await this.departmentService.findOne(department.toString()) as any;
      if (dept) {
        if (!dept.projectIds) dept.projectIds = [];
        dept.projectIds.push(saved._id);
        await this.departmentService.update(department.toString(), { projectIds: dept.projectIds }, user);
      }
    }
    return saved._id;
  }

  async findAll(currentPage: number = 1, limit: number = 10, startDate: string, endDate: string) {
    let offset = (+currentPage - 1) * (+limit || 10);
    let defaultLimit = +limit || 10;

    const whereClause: any = { isDeleted: false }; 

    const [result, totalItems] = await this.projectRepository.findAndCount({
      skip: offset,
      take: defaultLimit,
      where: whereClause,
      relations: ['tasks', 'manager', 'teamMembers'],
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);
    const projects = result as unknown as IProject[];

    const taskCompletedCounts = await Promise.all(
      projects.map((p: any) => this.taskService.countTask(3, p._id)),
    );
    const taskTotalCounts = await Promise.all(
      projects.map((p: any) => this.taskService.countTask(0, p._id)),
    );

    projects.forEach((project: any, index: number) => {
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
      result: projects,
    };
  }

  async findOne(id: string) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid project ID`);
    const project = await this.projectRepository.findOne({
      where: { _id: id, isDeleted: false },
      relations: ['teamMembers', 'manager'],
    }) as any;
    if (project) {
        project.progress = await this.progressCalculation(id);
    }
    return project as IProject;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: IUser) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid project ID`);

    const project = await this.projectRepository.findOne({ where: { _id: id } });
    if (!project) throw new BadRequestException('Project not found');

    const progress = await this.progressCalculation(id);
    
    // Convert related arrays
    const { teamMembers, tasks, manager, department, ...rest } = updateProjectDto as any;
    
    if (teamMembers) project.teamMembers = teamMembers.map((mId: string) => ({ _id: mId.toString() })) as any;
    if (tasks) project.tasks = tasks.map((tId: string) => ({ _id: tId.toString() })) as any;
    if (manager) project.manager = { _id: manager.toString() } as any;
    if (department) project.department = { _id: department.toString() } as any;

    Object.assign(project, {
      ...rest,
      progress: progress,
      updatedBy: { _id: user._id, email: user.email },
    });

    return await this.projectRepository.save(project);
  }

  async remove(id: string, user: IUser) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid project ID`);
    const project = await this.projectRepository.findOne({ where: { _id: id } });
    if (!project) throw new BadRequestException('Project not found');

    project.deletedBy = { _id: user._id, email: user.email };
    project.isDeleted = true;
    project.deletedAt = new Date();
    await this.projectRepository.save(project);

    return await this.projectRepository.softDelete({ _id: id });
  }
}
