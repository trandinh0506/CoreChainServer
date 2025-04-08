import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsService } from './departments.service';
import { getModelToken } from '@nestjs/mongoose'; // Dùng Mongoose
import { Department } from './schemas/department.schema'; // Import schema

describe('DepartmentsService', () => {
  let service: DepartmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DepartmentsService,
        {
          provide: getModelToken(Department.name), // Inject model Mongoose
          useValue: {
            find: jest.fn().mockResolvedValue([]), // Mock find()
            create: jest.fn().mockResolvedValue({ _id: '1', name: 'HR' }),
          },
        },
      ],
    }).compile();

    service = module.get<DepartmentsService>(DepartmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
