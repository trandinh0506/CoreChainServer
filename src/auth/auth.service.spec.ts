import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(), // Mock findOne function
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => 'fake-jwt-token'), // Mock JWT sign function
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data if password is correct', async () => {
      const mockUser = {
        id: 1,
        username: 'caongoc@gmail.com',
        password:
          '$2b$10$E97ffGc9XtWunBKok6loNOz80Q01HNnDgLvR0.XD0t59l2hV94PIK',
      };
      usersService.findOne = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('caongoc@gmail.com', '123');

      expect(result).toEqual(mockUser);
      expect(usersService.findOne).toHaveBeenCalledWith('caongoc@gmail.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('123', mockUser.password);
    });

    it('should return null if user is not found', async () => {
      usersService.findOne = jest.fn().mockResolvedValue(null);

      const result = await authService.validateUser('caongoc@gmail.com', '123');

      expect(result).toBeNull();
    });

    it('should return null if password is incorrect', async () => {
      const mockUser = {
        id: 1,
        username: 'caongoc@gmail.com',
        password:
          '$2b$10$E97ffGc9XtWunBKok6loNOz80Q01HNnDgLvR0.XD0t59l2hV94PIK',
      };
      usersService.findOne = jest.fn().mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authService.validateUser(
        'caongoc@gmail.com',
        'wrongPassword',
      );

      expect(result).toBeNull();
      expect(bcrypt.compare).toHaveBeenCalledWith(
        'wrongPassword',
        mockUser.password,
      );
    });
  });
});
