import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { CompleteUser, IUser } from 'src/users/users.interface';
import {
  UpdatePublicUserDto,
  UpdateUserDto,
  UpdateWorkingHoursDto,
} from 'src/users/dto/update-user.dto';
import {
  END_OF_MONTH,
  START_OF_MONTH,
  WORKING_HOURS_PER_DAY,
} from 'src/decorators/customize';
import { TasksService } from 'src/tasks/tasks.service';
import { SalaryAdvanceDto } from './dto/salary-advance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalaryAdvance } from './entities/salary-advance.entity';
import { ISalaryAdvance } from './personnel.interface';
import aqp from 'api-query-params';
import { aqpTypeormConverter } from 'src/utils/aqp.util';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectRepository(SalaryAdvance)
    private salaryAdvanceRepository: Repository<SalaryAdvance>,
    private userService: UsersService,
    private taskService: TasksService,
  ) {}

  isValidId(id: string) {
    return /^[0-9a-fA-F]{24}$/.test(id) || /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  }

  async calSalary(id: string, user: IUser) {
    try {
      const employee: CompleteUser = await this.userService.findPrivateOne(id);
      const baseSalary = Math.ceil(
        (employee.salary / (30 * WORKING_HOURS_PER_DAY)) *
          employee.workingHours,
      );
      const totalAdjustments = employee.adjustments
        .filter(
          (adj) =>
            new Date(adj.createdAt) >= START_OF_MONTH &&
            new Date(adj.createdAt) <= END_OF_MONTH,
        )
        .reduce((total, adj) => total + adj.amount, 0);
      const netSalary = baseSalary + totalAdjustments + employee.allowances;
      
      employee.netSalary = netSalary;
      employee.workingHours = 0;
      await this.userService.update(employee as unknown as UpdateUserDto, user, id);
      return netSalary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async salaryAdvance(salaryAdvanceDto: SalaryAdvanceDto, user: IUser) {
    const { amount, reason, returnDate } = salaryAdvanceDto;
    
    // Check pending requests
    const countSalaryAdvance = await this.salaryAdvanceRepository.count({
      where: {
        employee: { _id: user._id },
        isApproved: false,
        isDeleted: false
      }
    });

    if (amount <= 400 && countSalaryAdvance === 0) {
      const advance = this.salaryAdvanceRepository.create({
        employee: { _id: user._id } as any,
        amount,
        reason,
        isApproved: true,
        approvedBy: 'System',
        returnDate,
      });
      await this.salaryAdvanceRepository.save(advance);
      // Call Bank API to tranfer money automactically
    } else {
      const advance = this.salaryAdvanceRepository.create({
        employee: { _id: user._id } as any,
        amount,
        reason,
        returnDate,
        isApproved: false,
      });
      await this.salaryAdvanceRepository.save(advance);
    }
    return { message: 'Salary advance request successful !' };
  }

  async approveSalaryAdvance(user: IUser, id: string) {
    if (!this.isValidId(id)) throw new BadRequestException(`Invalid salary advance ID`);
    const advance = await this.salaryAdvanceRepository.findOne({ where: { _id: id } });
    if (!advance) throw new BadRequestException(`Invalid salary advance ID`);

    advance.isApproved = true;
    advance.approvedBy = {
      _id: user._id,
      email: user.email,
    };
    await this.salaryAdvanceRepository.save(advance);
    // Call Bank API to tranfer money automactically
    return { message: 'Approved salary advance !' };
  }

  async findOne(id: string) {
    if (!this.isValidId(id)) {
      throw new BadRequestException(`Invalid salary advance ID`);
    }
    return (await this.salaryAdvanceRepository.findOne({ where: {_id: id } })) as unknown as ISalaryAdvance;
  }

  async findAll(query: any) {
    const { filter, skip, limit, sort } = aqp(query);
    const convertedFilter = aqpTypeormConverter(filter);

    let defaultLimit = limit || 10;
    let offset = skip || 0;
    const currentPage = Math.floor(offset / defaultLimit) + 1;

    const [result, totalItems] = await this.salaryAdvanceRepository.findAndCount({
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
      result: result as unknown as ISalaryAdvance[],
    };
  }

  async calKpi(id: string, user: IUser) {
    try {
      const notCompleteTask = await this.taskService.countTaskInMonth(0, id);
      const completeTask = await this.taskService.countTaskInMonth(3, id);
      const kpi = completeTask ? (notCompleteTask / completeTask) * 100 : 0;
      const updateDto: UpdatePublicUserDto = { kpi: kpi };
      await this.userService.updatePublicUser(updateDto, user, id);
      return kpi;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async addAdjustments(
    id: string,
    updatePersonnelDto: UpdatePersonnelDto,
    user: IUser,
  ) {
    const employee: CompleteUser = await this.userService.findPrivateOne(id);
    if (!employee.adjustments) {
      employee.adjustments = [];
    }
    updatePersonnelDto.adjustment.createdAt = new Date();
    employee.adjustments.push(updatePersonnelDto.adjustment);
    return this.userService.update(employee as unknown as UpdateUserDto, user, id);
  }

  async updateWorkingHours(
    updateWorkingHoursDto: UpdateWorkingHoursDto,
    user: IUser,
    id: string,
  ) {
    return this.userService.updateWorkingHours(updateWorkingHoursDto, user, id);
  }
}
