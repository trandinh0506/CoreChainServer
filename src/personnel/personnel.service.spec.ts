import { Test, TestingModule } from '@nestjs/testing';
import { PersonnelService } from './personnel.service';
import { getModelToken } from '@nestjs/mongoose';
import { SalaryAdvance } from './schemas/salary-advance.schema';
import { UsersService } from 'src/users/users.service';
import { TasksService } from 'src/tasks/tasks.service';

describe('PersonnelService', () => {
  let service: PersonnelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonnelService,
        {
          provide: getModelToken(SalaryAdvance.name),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue({ _id: '1', name: 'HR' }),
            countDocuments: jest.fn().mockResolvedValue(0),
            findById: jest.fn().mockResolvedValue(null),
            updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findPrivateOne: jest.fn().mockResolvedValue({
              _id: '1',
              salary: 5000,
              workingHours: 160,
              adjustments: [],
              allowances: 0,
            }),
            update: jest.fn().mockResolvedValue({}),
            updatePublicUser: jest.fn().mockResolvedValue({}),
            updateWorkingHours: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: TasksService,
          useValue: {
            countTaskInMonth: jest.fn().mockResolvedValue(0),
          },
        },
      ],
    }).compile();

    service = module.get<PersonnelService>(PersonnelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
