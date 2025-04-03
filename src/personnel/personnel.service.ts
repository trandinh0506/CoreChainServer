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
import { InjectModel } from '@nestjs/mongoose';
import {
  SalaryAdvance,
  SalaryAdvanceDocument,
} from './schemas/salary-advance.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class PersonnelService {
  constructor(
    @InjectModel(SalaryAdvance.name)
    private salaryAdvanceModel: SoftDeleteModel<SalaryAdvanceDocument>,
    private userService: UsersService,
    private taskService: TasksService,
  ) {}
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
      console.log(netSalary);
      employee.netSalary = netSalary;
      employee.workingHours = 0;
      await this.userService.update(employee as UpdateUserDto, user, id);
      return netSalary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async salaryAdvance(salaryAdvanceDto: SalaryAdvanceDto, user: IUser) {
    const { amount, reason, returnDate } = salaryAdvanceDto;
    const countSalaryAdvance = await this.salaryAdvanceModel.countDocuments({
      _id: user._id,
      isApproved: false,
    });
    if (amount <= 400 && countSalaryAdvance === 0) {
      await this.salaryAdvanceModel.create({
        employee: user._id,
        amount,
        reason,
        isApproved: true,
        approvedBy: 'System',
        returnDate,
      });
      // Call Bank API to tranfer money automactically
    } else {
      await this.salaryAdvanceModel.create({
        employee: user._id,
        amount,
        reason,
        returnDate,
        isApproved: false,
      });
    }
    return { message: 'Salary advance request successful !' };
  }

  async approveSalaryAdvance(user: IUser, id: string) {
    await this.salaryAdvanceModel.updateOne(
      { _id: id },
      {
        isApproved: true,
        approvedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    // Call Bank API to tranfer money automactically
    return { message: 'Approved salary advance !' };
  }

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid salary advance ID`);
    }
    return this.salaryAdvanceModel.findById(id);
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, skip, sort, projection, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;
    filter.isDeleted = false;
    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.salaryAdvanceModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.salaryAdvanceModel
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
  async calKpi(id: string, user: IUser) {
    try {
      const notCompleteTask = await this.taskService.countTaskInMonth(0, id);
      const completeTask = await this.taskService.countTaskInMonth(3, id);
      const kpi = (notCompleteTask / completeTask) * 100 || 0;
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
    return this.userService.update(employee as UpdateUserDto, user, id);
  }

  async updateWorkingHours(
    updateWorkingHoursDto: UpdateWorkingHoursDto,
    user: IUser,
    id: string,
  ) {
    return this.userService.updateWorkingHours(updateWorkingHoursDto, user, id);
  }
}
