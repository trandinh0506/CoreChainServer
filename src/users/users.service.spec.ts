import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { FabricService } from 'src/fabric/fabric.service';
import { SecurityService } from 'src/security/security.service';
import { DepartmentsService } from 'src/departments/departments.service';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: any;

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

  const mockUserRepository = {
    findAndCount: jest.fn().mockResolvedValue([[mockUser], 1]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn(),
    save: jest.fn().mockResolvedValue(mockUser),
  };

  const mockCacheManager = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  };

  const mockDataSource = {
    createQueryRunner: jest.fn().mockReturnValue({
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      manager: {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
      }
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: 'DataSource',
          useValue: mockDataSource
        },
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager
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
    userRepository = module.get(getRepositoryToken(User));
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

      mockUserRepository.findAndCount.mockResolvedValueOnce([[mockUser], 1]);
      const result = await service.findAll({});
      expect(result).toEqual(mockResult);
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      mockUserRepository.findOne.mockResolvedValueOnce(mockUser);

      const result = await service.findOne('507f1f77bcf86cd799439011');
      const { ...publicUser } = mockUser;
      expect(result).toEqual(publicUser);
    });
  });
});
