import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { PublicUser } from './users.interface';
import { ConfigService } from '@nestjs/config';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { SecurityService } from 'src/security/security.service';
import { DepartmentsService } from 'src/departments/departments.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUserModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      switch (key) {
        case 'JWT_ACCESS_TOKEN_SECRET':
          return 'test-secret';
        default:
          return null;
      }
    }),
  };

  const mockBlockchainService = {
    addEmployee: jest.fn().mockResolvedValue('mock-tx-hash'),
  };

  const mockSecurityService = {
    // Add mock methods as needed
  };

  const mockDepartmentsService = {
    findOne: jest.fn().mockResolvedValue({ employees: [] }),
    update: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: BlockchainService,
          useValue: mockBlockchainService,
        },
        {
          provide: SecurityService,
          useValue: mockSecurityService,
        },
        {
          provide: DepartmentsService,
          useValue: mockDepartmentsService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [{ name: 'Test User' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockUsers as any);

      const result = await controller.findAll('1', '1000', '');
      expect(result).toEqual(mockUsers);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const mockUser = { name: 'Test User' };
      jest.spyOn(service, 'findOne').mockResolvedValue(mockUser as PublicUser);

      const result = await controller.findOne('test-id');
      expect(result).toEqual(mockUser);
      expect(service.findOne).toHaveBeenCalledWith('test-id');
    });
  });
});
