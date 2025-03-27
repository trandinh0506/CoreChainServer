import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import { UpdateWorkingHoursDto } from 'src/users/dto/update-user.dto';
import { SalaryAdvanceDto } from './dto/salary-advance.dto';

@Controller('personnel')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}
  @Get('salary/:id')
  calculateSalary(@Param('id') id: string, @User() user: IUser) {
    return this.personnelService.calSalary(id, user);
  }

  @Post('salary')
  salaryAdvance(
    @Body() salaryAdvanceDto: SalaryAdvanceDto,
    @User() user: IUser,
  ) {
    return this.personnelService.salaryAdvance(salaryAdvanceDto, user);
  }

  @Get('kpi/:id')
  calculateKpi(@Param('id') id: string, @User() user: IUser) {
    return this.personnelService.calKpi(id, user);
  }

  @Post('adjustments/:id')
  addAdjustments(
    @Param('id') id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
    @User() user: IUser,
  ) {
    return this.personnelService.addAdjustments(id, updatePersonnelDto, user);
  }

  @Patch('working/:id')
  updateWorkingHours(
    @Body() updateWorkingHoursDto: UpdateWorkingHoursDto,
    @Param('id') id: string,
    @User() user: IUser,
  ) {
    return this.personnelService.updateWorkingHours(
      updateWorkingHoursDto,
      user,
      id,
    );
  }
}
