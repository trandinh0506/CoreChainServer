import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { IUser } from 'src/users/users.interface';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { WORKING_HOURS_PER_DAY } from 'src/decorators/customize';

@Injectable()
export class PersonnelService {
  constructor(private userService: UsersService) {}
  async calSalary(id: string) {
    try {
      const user: UpdateUserDto = await this.userService.findPrivateOne(id);
      const baseSalary = Math.ceil(
        (user.salary / (30 * WORKING_HOURS_PER_DAY)) * user.workingHours,
      );
      const totalAdjustments = user.adjustments.reduce(
        (total, adj) => total + adj.amount,
        0,
      );
      const netSalary = baseSalary + totalAdjustments + user.allowances;
      return netSalary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async calKpi(id: string) {}
  async addAdjustments(
    id: string,
    updatePersonnelDto: UpdatePersonnelDto,
    user: IUser,
  ) {
    const employee: UpdateUserDto = await this.userService.findPrivateOne(id);
    if (!employee.adjustments) {
      employee.adjustments = [];
    }
    employee.adjustments.push(updatePersonnelDto.adjustment);
    return this.userService.update(employee, user, id);
  }
}
