import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Contract } from './schemas/contract.schema';
import mongoose from 'mongoose';
import { IUser } from '../users/users.interface';

describe('ContractsController', () => {
  let controller: ContractsController;
  let service: ContractsService;

  // Create valid MongoDB ObjectIds for testing
  const mockContractId = new mongoose.Types.ObjectId().toString();
  const mockEmployeeId = new mongoose.Types.ObjectId().toString();
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockRoleId = new mongoose.Types.ObjectId().toString();

  const mockContractModel = {
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
    create: jest.fn().mockResolvedValue({ _id: mockContractId }),
    findOne: jest.fn(),
    findById: jest.fn().mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    }),
    updateOne: jest.fn().mockResolvedValue({ modifiedCount: 1 }),
    softDelete: jest.fn().mockResolvedValue(true),
  };

  const mockUser: IUser = {
    _id: mockUserId,
    email: 'test@example.com',
    name: 'Test User',
    role: {
      _id: mockRoleId,
      name: 'Employee',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        ContractsService,
        {
          provide: getModelToken(Contract.name),
          useValue: mockContractModel,
        },
      ],
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new contract', async () => {
      const createContractDto = {
        contractCode: 'TEST-001',
        type: 'Full-time',
        file: 'contract.pdf',
        startDate: new Date(),
        endDate: new Date(),
        status: 'Active',
        employee: mockEmployeeId,
        salary: 5000,
        allowances: 500,
        insurance: 'Full coverage',
        workingHours: 40,
        leavePolicy: 'Standard',
        terminationTerms: 'Standard terms',
        confidentialityClause: 'Standard NDA',
      };

      const result = await controller.create(createContractDto, mockUser);
      expect(result).toBe(mockContractId);
    });
  });

  describe('findAll', () => {
    it('should return paginated contracts', async () => {
      const result = await controller.findAll('1', '10', '');
      expect(result).toBeDefined();
      expect(mockContractModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find a contract by id', async () => {
      await controller.findOne(mockContractId);
      expect(mockContractModel.findById).toHaveBeenCalledWith(mockContractId);
    });
  });

  describe('update', () => {
    it('should update a contract', async () => {
      const updateContractDto = {
        status: 'Inactive',
      };

      const result = await controller.update(
        mockContractId,
        updateContractDto,
        mockUser,
      );
      expect(result).toBeDefined();
      expect(mockContractModel.updateOne).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should soft delete a contract', async () => {
      const result = await controller.remove(mockContractId, mockUser);
      expect(result).toBeDefined();
      expect(mockContractModel.softDelete).toHaveBeenCalled();
    });
  });
});
