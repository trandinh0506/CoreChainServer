import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RolesService } from 'src/roles/roles.service';
import { Response } from 'express';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  const mockUsersService = {
    findOneByUsername: jest.fn(),
    isValidPassword: jest.fn(),
    updateUserToken: jest.fn(),
    getUserByToken: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token'),
    verify: jest.fn().mockReturnValue(true),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      switch (key) {
        case 'JWT_REFRESH_EXPIRE':
          return '7d';
        case 'JWT_REFRESH_TOKEN_SECRET':
          return 'refresh-secret';
        default:
          return '';
      }
    }),
  };

  const mockRolesService = {
    findOne: jest.fn().mockResolvedValue({
      _id: 'role-id',
      name: 'admin',
      permissions: ['read', 'write'],
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if password is correct', async () => {
      const mockUser = {
        _id: 'user-id',
        username: 'test@example.com',
        password: 'hashed_password',
        role: { _id: 'role-id', name: 'admin' },
        toObject: () => ({
          _id: 'user-id',
          username: 'test@example.com',
          role: { _id: 'role-id', name: 'admin' },
        }),
      };

      mockUsersService.findOneByUsername.mockResolvedValueOnce(mockUser);
      mockUsersService.isValidPassword.mockReturnValueOnce(true);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toBeDefined();
      expect(result.permissions).toEqual(['read', 'write']);
    });

    it('should return null if user is not found', async () => {
      mockUsersService.findOneByUsername.mockResolvedValueOnce(null);

      const result = await service.validateUser(
        'nonexistent@example.com',
        'password',
      );

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const mockUser = {
        username: 'test@example.com',
        password: 'hashed_password',
      };

      mockUsersService.findOneByUsername.mockResolvedValueOnce(mockUser);
      mockUsersService.isValidPassword.mockReturnValueOnce(false);

      const result = await service.validateUser(
        'test@example.com',
        'wrong_password',
      );

      expect(result).toBeNull();
    });
  });
});
