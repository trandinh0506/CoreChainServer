import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { UsersService } from 'src/users/users.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { PositionsService } from 'src/positions/positions.service';
import { END_OF_MONTH, START_OF_MONTH, System } from 'src/decorators/customize';
import { PersonnelService } from 'src/personnel/personnel.service';
import { CompleteUser } from 'src/users/users.interface';
import {
  IDayOff,
  IEmployeesDepartment,
  IEmployeesTurnover,
  IKPI,
  ISalary,
  IWorkingHours,
} from './report.interface';
interface Result {}
@Injectable()
export class ReportsService {
  constructor(
    private readonly userService: UsersService,
    private readonly departmentService: DepartmentsService,
    private readonly positionService: PositionsService,
    private readonly personnelService: PersonnelService,
  ) {}
  async employeesReport() {
    const { result: departments } = await this.departmentService.findAll(
      1,
      1000,
      '',
    );

    const departmentReports: IEmployeesDepartment[] = await Promise.all(
      departments.map(async (department) => {
        const employees = await this.userService.findByIds(
          department.employees.map((id) => id.toString()),
        );
        return {
          department: department.name,
          employees: employees,
        } as IEmployeesDepartment;
      }),
    );

    return departmentReports;
  }

  async employeesTurnover() {
    const startOfMonth = START_OF_MONTH.toISOString();
    const endOfMonth = END_OF_MONTH.toISOString();
    const resignedQs = `deletedAt>${startOfMonth}&deletedAt<${endOfMonth}&isDeleted=true`;
    const newQs = `createdAt>${startOfMonth}&createdAt<${endOfMonth}&isDeleted=false`;

    const resignedEmployees = (
      await this.userService.findAll(1, 1000, resignedQs)
    ).result;
    const newEmployees = (await this.userService.findAll(1, 1000, newQs))
      .result;
    return {
      resignedEmployees,
      newEmployees,
    } as IEmployeesTurnover;
  }

  async workingHours() {
    const { result: departments } = await this.departmentService.findAll(
      1,
      1000,
      '',
    );

    const workingHoursReports: IWorkingHours[] = await Promise.all(
      departments.map(async (department) => {
        const employees = await this.userService.findByIds(
          department.employees.map((id) => id.toString()),
        );
        const result = [];
        for (let empl of employees) {
          result.push({
            _id: empl._id,
            name: empl.name,
            email: empl.email,
            avatar: empl.avatar,
            workingHours: empl.workingHours || 0,
          });
        }

        return {
          department: department.name,
          employees: result,
        };
      }),
    );

    return workingHoursReports;
  }

  async dayOff() {
    const { result: departments } = await this.departmentService.findAll(
      1,
      1000,
      '',
    );

    const dayOffReports: IDayOff[] = await Promise.all(
      departments.map(async (department) => {
        const employees = await this.userService.findByIds(
          department.employees.map((id) => id.toString()),
        );
        const result = [];
        for (let empl of employees) {
          result.push({
            _id: empl._id,
            name: empl.name,
            email: empl.email,
            avatar: empl.avatar,
            dayOff: empl.dayOff || 0,
          });
        }

        return {
          department: department.name,
          employees: result,
        };
      }),
    );

    return dayOffReports;
  }

  async kpi() {
    const { result: departments } = await this.departmentService.findAll(
      1,
      1000,
      '',
    );

    const KPIReports: IKPI[] = await Promise.all(
      departments.map(async (department) => {
        const employees = await this.userService.findByIds(
          department.employees.map((id) => id.toString()),
        );
        const result = [];
        for (let empl of employees) {
          if (!empl.kpi) {
            await this.personnelService.calKpi(empl._id.toString(), System);
          }
          result.push({
            _id: empl._id,
            name: empl.name,
            email: empl.email,
            avatar: empl.avatar,
            kpi: empl.kpi || 0,
          });
        }
        result.sort((a, b) => b.kpi - a.kpi);
        return {
          department: department.name,
          employees: result,
        };
      }),
    );

    return KPIReports;
  }

  async salary() {
    const { result: departments } = await this.departmentService.findAll(
      1,
      1000,
      '',
    );
    let amount = 0;
    const salaryReports: ISalary[] = await Promise.all(
      departments.map(async (department) => {
        const employees = await this.userService.findByIds(
          department.employees.map((id) => id.toString()),
        );
        const result = [];
        for (let empl of employees) {
          const privateEmpl: CompleteUser =
            await this.userService.findPrivateOne(empl._id.toString());
          if (!privateEmpl.netSalary) {
            privateEmpl.netSalary = await this.personnelService.calSalary(
              empl._id.toString(),
              System,
            );
          }
          amount += privateEmpl.netSalary;
          result.push({
            _id: empl._id,
            name: empl.name,
            email: empl.email,
            avatar: empl.avatar,
            salary: privateEmpl.salary,
            allowances: privateEmpl.allowances,
            adjustments: privateEmpl.adjustments,
            netSalary: privateEmpl.netSalary,
          });
        }

        return {
          department: department.name,
          employees: result,
          amount: amount,
        };
      }),
    );

    return salaryReports;
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
