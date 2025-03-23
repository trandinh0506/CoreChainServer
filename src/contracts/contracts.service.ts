import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { IUser } from 'src/users/users.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Contract, ContractDocument } from './schemas/contract.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name)
    private contractModel: SoftDeleteModel<ContractDocument>,
  ) {}
  async create(createContractDto: CreateContractDto, user: IUser) {
    const isExist = await this.contractModel.findOne({
      contractCode: createContractDto.contractCode,
    });
    if (isExist) {
      throw new BadRequestException('Contract already exist !');
    }
    const newContract = await this.contractModel.create({
      ...createContractDto,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });
    return newContract;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.contractModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.contractModel
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
      throw new BadRequestException(`Invalid contract ID`);
    }
    return (await this.contractModel.findById(id)).populate({
      path: 'employee',
      select: 'name email',
    });
  }

  async update(id: string, updateContractDto: UpdateContractDto, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid contract ID`);
    }
    return this.contractModel.updateOne(
      { _id: id },
      {
        ...updateContractDto,
        updatedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid contract ID`);
    }
    await this.contractModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: id,
          email: user.email,
        },
      },
    );
    return this.contractModel.softDelete({ _id: id });
  }
}
