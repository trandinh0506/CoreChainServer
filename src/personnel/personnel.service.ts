import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { IUser } from 'src/users/users.interface';
import {
  UpdateUserDto,
  UpdateWorkingHoursDto,
} from 'src/users/dto/update-user.dto';
import {
  END_OF_MONTH,
  START_OF_MONTH,
  WORKING_HOURS_PER_DAY,
} from 'src/decorators/customize';
import { TasksService } from 'src/tasks/tasks.service';

@Injectable()
export class PersonnelService {
  constructor(
    private userService: UsersService,
    private taskService: TasksService,
  ) {}
  async calSalary(id: string, user: IUser) {
    try {
      const employee: UpdateUserDto = await this.userService.findPrivateOne(id);
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

      employee.workingHours = 0;
      await this.userService.update(employee, user, id);
      return netSalary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async calKpi(id: string) {
    try {
      const notCompleteTask = await this.taskService.countTaskInMonth(0, id);
      const completeTask = await this.taskService.countTaskInMonth(3, id);
      return (notCompleteTask / completeTask) * 100;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async addAdjustments(
    id: string,
    updatePersonnelDto: UpdatePersonnelDto,
    user: IUser,
  ) {
    const employee: UpdateUserDto = await this.userService.findPrivateOne(id);
    if (!employee.adjustments) {
      employee.adjustments = [];
    }
    updatePersonnelDto.adjustment.createdAt = new Date();
    employee.adjustments.push(updatePersonnelDto.adjustment);
    return this.userService.update(employee, user, id);
  }

  async updateWorkingHours(
    updateWorkingHoursDto: UpdateWorkingHoursDto,
    user: IUser,
    id: string,
  ) {
    return this.userService.updateWorkingHours(updateWorkingHoursDto, user, id);
  }
}
