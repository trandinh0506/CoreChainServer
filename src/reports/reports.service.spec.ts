import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { getModelToken } from '@nestjs/mongoose';
import { Report } from './schemas/report.schema';
import { UsersService } from 'src/users/users.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { PositionsService } from 'src/positions/positions.service';
import { PersonnelService } from 'src/personnel/personnel.service';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue({ result: [] }),
    findByIds: jest.fn().mockResolvedValue([]),
    findPrivateOne: jest.fn().mockResolvedValue({}),
  };

  const mockDepartmentsService = {
    findAll: jest.fn().mockResolvedValue({ result: [] }),
  };

  const mockPositionsService = {
    findAll: jest.fn().mockResolvedValue({ result: [] }),
  };

  const mockPersonnelService = {
    calKpi: jest.fn().mockResolvedValue(0),
    calSalary: jest.fn().mockResolvedValue(0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getModelToken(Report.name),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue({ _id: '1', name: 'HR' }),
          },
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: DepartmentsService,
          useValue: mockDepartmentsService,
        },
        {
          provide: PositionsService,
          useValue: mockPositionsService,
        },
        {
          provide: PersonnelService,
          useValue: mockPersonnelService,
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
