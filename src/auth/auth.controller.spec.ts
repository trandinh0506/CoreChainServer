import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesService } from 'src/roles/roles.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { Response } from 'express';
import { ThrottlerModule } from '@nestjs/throttler';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let rolesService: RolesService;

  const mockAuthService = {
    login: jest.fn().mockResolvedValue({
      access_token: 'test-token',
      user: {
        _id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: { _id: 'role-id', name: 'admin' },
        permissions: ['read', 'write'],
      },
    }),
    processNewToken: jest.fn(),
    logout: jest.fn().mockResolvedValue('ok'),
  };

  const mockRolesService = {
    findOne: jest.fn().mockResolvedValue({
      _id: 'role-id',
      name: 'admin',
      permissions: ['read', 'write'],
    }),
  };

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
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot([
          {
            name: 'short',
            ttl: 1000,
            limit: 3,
          },
        ]),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
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
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    rolesService = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleLogin', () => {
    it('should return login response', async () => {
      const mockReq = {
        user: {
          _id: 'user-id',
          name: 'Test User',
          email: 'test@example.com',
          role: { _id: 'role-id', name: 'admin' },
        },
      };
      const mockRes = {
        cookie: jest.fn(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
        send: jest.fn().mockReturnThis(),
      } as unknown as Response;

      const result = await controller.handleLogin(mockReq, mockRes);

      expect(result).toEqual({
        access_token: 'test-token',
        user: {
          _id: 'user-id',
          name: 'Test User',
          email: 'test@example.com',
          role: { _id: 'role-id', name: 'admin' },
          permissions: ['read', 'write'],
        },
      });
      expect(mockAuthService.login).toHaveBeenCalledWith(mockReq.user, mockRes);
    });
  });

  describe('handleGetAccount', () => {
    it('should return user account with permissions', async () => {
      const mockUser = {
        _id: 'user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: { _id: 'role-id', name: 'admin' },
      };

      const result = await controller.handleGetAccount(mockUser);

      expect(result).toEqual({
        user: {
          ...mockUser,
          permissions: ['read', 'write'],
        },
      });
      expect(mockRolesService.findOne).toHaveBeenCalledWith('role-id');
    });
  });
});
