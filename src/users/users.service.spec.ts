import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { PublicUser } from './users.interface';
import { ConfigService } from '@nestjs/config';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { SecurityService } from 'src/security/security.service';
import { DepartmentsService } from 'src/departments/departments.service';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;

  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'Test User',
    email: 'test@example.com',
    avatar: 'avatar.jpg',
    role: {
      _id: '507f1f77bcf86cd799439012',
      name: 'Employee',
    },
  };

  const mockUserModel = {
    find: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([mockUser]),
    }),
    findOne: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }),
    findById: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }),
    create: jest.fn(),
    updateOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: BlockchainService,
          useValue: {
            addEmployee: jest.fn().mockResolvedValue('mock-tx-hash'),
            getEmployee: jest.fn().mockResolvedValue({}),
            updateEmployee: jest.fn().mockResolvedValue('mock-tx-hash'),
            deactivateEmployee: jest.fn().mockResolvedValue('mock-tx-hash'),
          },
        },
        {
          provide: SecurityService,
          useValue: {
            encrypt: jest.fn(),
            decrypt: jest.fn(),
          },
        },
        {
          provide: DepartmentsService,
          useValue: {
            findOne: jest.fn().mockResolvedValue({ employees: [] }),
            update: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockResult = {
        meta: {
          current: 1,
          pageSize: 10,
          pages: 1,
          total: 1,
        },
        result: [mockUser],
      };

      // First find call for counting total items
      mockUserModel.find.mockImplementationOnce(() => ({
        exec: jest.fn().mockResolvedValue([mockUser]),
      }));

      // Second find call for actual results
      mockUserModel.find.mockImplementationOnce(() => ({
        select: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockUser]),
      }));

      const result = await service.findAll(1, 10, '');
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserModel.findOne().lean.mockResolvedValueOnce(mockUser);

      const result = await service.findOne('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockUser);
    });
  });
});
