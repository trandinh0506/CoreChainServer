import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('employees')
  employee() {
    return this.reportsService.employeesReport();
  }

  @Get('employees-turnover')
  employeesTurnover() {
    return this.reportsService.employeesTurnover();
  }

  @Get('working-hours')
  workingHours() {
    return this.reportsService.workingHours();
  }

  @Get('day-off')
  dayOff() {
    return this.reportsService.dayOff();
  }

  @Get('kpi')
  kpi() {
    return this.reportsService.kpi();
  }

  @Get('salary')
  salary() {
    return this.reportsService.salary();
  }

  @Post()
  create(@Body() createReportDto: CreateReportDto) {
    return this.reportsService.create(createReportDto);
  }

  @Get()
  findAll() {
    return this.reportsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReportDto: UpdateReportDto) {
    return this.reportsService.update(+id, updateReportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reportsService.remove(+id);
  }
}
