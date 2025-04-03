import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Position, PositionDocument } from './schemas/position.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';
import { IPosition } from './position.interface';

@Injectable()
export class PositionsService {
  constructor(
    @InjectModel(Position.name)
    private positionModel: SoftDeleteModel<PositionDocument>,
  ) {}
  async create(createPositionDto: CreatePositionDto, user: IUser) {
    const { title, description, parentId, level } = createPositionDto;
    const isExist = await this.positionModel.findOne({ title: title });
    if (isExist) {
      throw new BadRequestException('Position already exist !');
    }
    const newPosition = await this.positionModel.create({
      title,
      description,
      parentId,
      level,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newPosition._id;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.positionModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result: IPosition[] = await this.positionModel
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
      throw new BadRequestException(`Invalid position ID`);
    }
    const position: IPosition = await this.positionModel.findById(id);
  }

  async update(id: string, updatePositionDto: UpdatePositionDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid position ID`);
    }
    return this.positionModel.updateOne(
      { _id: id },
      {
        ...updatePositionDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid position ID`);
    }
    await this.positionModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.positionModel.softDelete({ _id: id });
  }
}
