import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private projectModel: SoftDeleteModel<ProjectDocument>,
  ) {}
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
    return newProject;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.projectModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.projectModel
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
      throw new BadRequestException(`Invalid project ID`);
    }
    return this.projectModel
      .findOne({ _id: id })
      .populate([{ path: 'teamMembers', select: '_id name email' }]);
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid project ID`);
    }
    return this.projectModel.updateOne(
      { _id: id },
      {
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
