import { Test, TestingModule } from '@nestjs/testing';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';
import { getModelToken } from '@nestjs/mongoose';
import { Department } from './schemas/department.schema';
import { IDepartment } from './department.interface';
import mongoose from 'mongoose';

describe('DepartmentsController', () => {
  let controller: DepartmentsController;
  let service: DepartmentsService;

  const mockDepartmentModel = {
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DepartmentsController],
      providers: [
        DepartmentsService,
        {
          provide: getModelToken(Department.name),
          useValue: mockDepartmentModel,
        },
      ],
    }).compile();

    controller = module.get<DepartmentsController>(DepartmentsController);
    service = module.get<DepartmentsService>(DepartmentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated departments', async () => {
      const mockDepartments: IDepartment[] = [
        {
          _id: new mongoose.Types.ObjectId(),
          name: 'IT Department',
          code: 'IT',
          description: 'Information Technology Department',
          manager: new mongoose.Types.ObjectId().toString(),
          employees: [],
          status: 'Active',
          budget: 100000,
          projectIds: [],
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          createdBy: {
            _id: new mongoose.Types.ObjectId().toString(),
            email: 'admin@example.com',
          },
          updatedBy: null,
          deletedBy: null,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue({
        meta: {
          current: 1,
          pageSize: 10,
          pages: 1,
          total: 1,
        },
        result: mockDepartments,
      });

      const result = await controller.findAll('1', '10', '');
      expect(result.result).toEqual(mockDepartments);
    });
  });
});
