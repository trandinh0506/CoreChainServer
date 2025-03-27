import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';
import { UpdateWorkingHoursDto } from 'src/users/dto/update-user.dto';
import { SalaryAdvanceDto } from './dto/salary-advance.dto';

@Controller('personnel')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}
  @Get('salary/calculate/:id')
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

  @Post('salary/approve/:id')
  approveSalaryAdvance(@User() user: IUser, @Param('id') id: string) {
    return this.personnelService.approveSalaryAdvance(user, id);
  }

  @Get('salary/:id')
  findOne(@Param() id: string) {
    return this.personnelService.findOne(id);
  }

  @Get('salary')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.personnelService.findAll(+currentPage, +limit, qs);
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
