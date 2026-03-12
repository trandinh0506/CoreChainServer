import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { IUser } from 'src/users/users.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { IContract } from './contract.interface';

@Injectable()
export class ContractsService {
  constructor(
    @InjectRepository(Contract)
    private contractRepository: Repository<Contract>,
  ) {}

  isValidId(id: string) {
    return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  async create(createContractDto: CreateContractDto, user: IUser) {
    const isExist = await this.contractRepository.findOne({
      where: { contractCode: createContractDto.contractCode },
    });
    if (isExist) {
        throw new BadRequestException('Contract already exist !');
    }

    const newContract = this.contractRepository.create({
      ...createContractDto,
      employee: { _id: createContractDto.employee?.toString() } as any,
      createdBy: {
        _id: user._id,
        email: user.email,
      },
    });

    const saved = await this.contractRepository.save(newContract);
    return saved._id;
  }

  async findAll(currentPage: number = 1, limit: number = 10) {
    let offset = (+currentPage - 1) * (+limit || 10);
    let defaultLimit = +limit || 10;

    const [result, totalItems] = await this.contractRepository.findAndCount({
      skip: offset,
      take: defaultLimit,
      where: { isDeleted: false },
      relations: ['employee'], // Corresponds to population path='employee'
    });

    const totalPages = Math.ceil(totalItems / defaultLimit);

    return {
      meta: {
        current: currentPage,
        pageSize: limit,
        pages: totalPages,
        total: totalItems,
      },
      result: result as unknown as IContract[],
    };
  }

  async findOne(id: string) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid contract ID`);
    const contract = await this.contractRepository.findOne({
      where: { _id: id, isDeleted: false },
      relations: ['employee'],
    });

    return contract as unknown as IContract;
  }

  async update(id: string, updateContractDto: UpdateContractDto, user: IUser) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid contract ID`);
    const contract = await this.contractRepository.findOne({ where: { _id: id } });
    if (!contract) throw new BadRequestException(`Invalid contract ID`);

    const { employee, ...rest } = updateContractDto as any;
    if (employee) contract.employee = { _id: employee.toString() } as any;

    Object.assign(contract, {
      ...rest,
      updatedBy: {
        _id: user._id,
        email: user.email,
      },
    });

    return await this.contractRepository.save(contract);
  }

  async remove(id: string, user: IUser) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid contract ID`);
    const contract = await this.contractRepository.findOne({ where: { _id: id } });
    if (!contract) throw new BadRequestException(`Invalid contract ID`);

    contract.deletedBy = {
      _id: user._id,
      email: user.email,
    };
    contract.isDeleted = true;
    contract.deletedAt = new Date();
    await this.contractRepository.save(contract);

    return this.contractRepository.softDelete({ _id: id });
  }
}
