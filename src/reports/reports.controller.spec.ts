import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { UsersService } from 'src/users/users.service';
import { DepartmentsService } from 'src/departments/departments.service';
import { PositionsService } from 'src/positions/positions.service';
import { PersonnelService } from 'src/personnel/personnel.service';

describe('ReportsController', () => {
  let controller: ReportsController;

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
      controllers: [ReportsController],
      providers: [
        ReportsService,
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

    controller = module.get<ReportsController>(ReportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
