import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UsersService } from 'src/users/users.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { PositionsService } from 'src/positions/positions.service';
interface Result {}
@Injectable()
export class ReportsService {
  constructor(
    private readonly userService: UsersService,
    private readonly departmentService: DepartmentsService,
    private readonly positionService: PositionsService,
  ) {}
  async employeesReport() {
    const { result: departments } = await this.departmentService.findAll(
      1,
      1000,
      '',
    );

    const departmentReports = await Promise.all(
      departments.map(async (department) => {
        const employees = await this.userService.findByIds(
          department.employees.map((id) => id.toString()),
        );

        return {
          department: department.name,
          employees: employees,
        };
      }),
    );

    return departmentReports;
  }

  create(createReportDto: CreateReportDto) {
    return 'This action adds a new report';
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
