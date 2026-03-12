import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePositionDto } from './dto/create-position.dto';
import { UpdatePositionDto } from './dto/update-position.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Position } from './entities/position.entity';
import { IPosition } from './position.interface';
import aqp from 'api-query-params';
import { aqpTypeormConverter } from 'src/utils/aqp.util';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionRepository: Repository<Position>,
  ) {}

  isValidId(id: string) {
    return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  async create(createPositionDto: CreatePositionDto, user: IUser) {
    const { title, description, parentId, level } = createPositionDto;
    const isExist = await this.positionRepository.findOne({ where: { title } });
    if (isExist) {
      throw new BadRequestException('Position already exist !');
    }
    const newPosition = this.positionRepository.create({
      title,
      description,
      parentId,
      level,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    const saved = await this.positionRepository.save(newPosition);
    return saved._id;
  }

  async findAll(query: any) {
    const { filter, skip, limit, sort } = aqp(query);
    const convertedFilter = aqpTypeormConverter(filter);

    let defaultLimit = limit || 10;
    let offset = skip || 0;
    const currentPage = Math.floor(offset / defaultLimit) + 1;

    const [result, totalItems] = await this.positionRepository.findAndCount({
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
      result: result as unknown as IPosition[],
    };
  }

  async findOne(id: string) {
    if (!this.isValidId(id)) {
      throw new BadRequestException(`Invalid position ID`);
    }
    return (await this.positionRepository.findOne({ where: { _id: id } })) as unknown as IPosition;
  }

  async update(id: string, updatePositionDto: UpdatePositionDto, user: IUser) {
    if (!this.isValidId(id)) {
      throw new BadRequestException(`Invalid position ID`);
    }

    const pos = await this.positionRepository.findOne({ where: { _id: id } });
    if (!pos) throw new BadRequestException(`Invalid position ID`);

    Object.assign(pos, {
      ...updatePositionDto,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return await this.positionRepository.save(pos);
  }

  async remove(id: string, user: IUser) {
    if (!this.isValidId(id)) {
      throw new BadRequestException(`Invalid position ID`);
    }

    const pos = await this.positionRepository.findOne({ where: { _id: id } });
    if (!pos) throw new BadRequestException(`Invalid position ID`);

    pos.updatedBy = {
      _id: user._id,
      email: user.email,
    };
    pos.isDeleted = true;
    pos.deletedAt = new Date();
    await this.positionRepository.save(pos);

    return await this.positionRepository.softDelete({ _id: id });
  }
}
