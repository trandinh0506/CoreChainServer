import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PersonnelService } from './personnel.service';
import { UpdatePersonnelDto } from './dto/update-personnel.dto';
import { User } from 'src/decorators/customize';
import { IUser } from 'src/users/users.interface';

@Controller('personnel')
export class PersonnelController {
  constructor(private readonly personnelService: PersonnelService) {}
  @Get('salary/:id')
  calculateSalary(@Param('id') id: string, @User() user: IUser) {
    return this.personnelService.calSalary(id, user);
  }

  @Get('kpi/:id')
  calculateKpi(@Param('id') id: string) {
    return this.personnelService.calKpi(id);
  }

  @Post('adjustments/:id')
  addAdjustments(
    @Param('id') id: string,
    @Body() updatePersonnelDto: UpdatePersonnelDto,
    @User() user: IUser,
  ) {
    return this.personnelService.addAdjustments(id, updatePersonnelDto, user);
  }
}
