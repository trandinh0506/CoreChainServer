import { Test, TestingModule } from '@nestjs/testing';
import { PersonnelController } from './personnel.controller';
import { PersonnelService } from './personnel.service';
import { getModelToken } from '@nestjs/mongoose';
import { SalaryAdvance } from './schemas/salary-advance.schema';
import { UsersService } from 'src/users/users.service';
import { TasksService } from 'src/tasks/tasks.service';

describe('PersonnelController', () => {
  let controller: PersonnelController;
  let service: PersonnelService;

  const mockSalaryAdvanceModel = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({}),
    findById: jest.fn().mockResolvedValue(null),
    updateOne: jest.fn().mockResolvedValue({}),
    countDocuments: jest.fn().mockResolvedValue(0),
  };

  const mockUsersService = {
    findPrivateOne: jest.fn().mockResolvedValue({
      salary: 1000,
      workingHours: 160,
      adjustments: [],
      allowances: 0,
    }),
    update: jest.fn().mockResolvedValue({}),
    updatePublicUser: jest.fn().mockResolvedValue({}),
    updateWorkingHours: jest.fn().mockResolvedValue({}),
  };

  const mockTasksService = {
    countTaskInMonth: jest.fn().mockResolvedValue(0),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonnelController],
      providers: [
        PersonnelService,
        {
          provide: getModelToken(SalaryAdvance.name),
          useValue: mockSalaryAdvanceModel,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<PersonnelController>(PersonnelController);
    service = module.get<PersonnelService>(PersonnelService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases here for specific controller methods
});
