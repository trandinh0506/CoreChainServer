import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { IUser } from 'src/users/users.interface';
import { Types } from 'mongoose';

describe('PermissionsController', () => {
  let controller: PermissionsController;
  let service: PermissionsService;

  const mockPermissionsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: IUser = {
    _id: new Types.ObjectId().toString(),
    email: 'test@example.com',
    name: 'Test User',
    role: { _id: new Types.ObjectId().toString(), name: 'Admin' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PermissionsController],
      providers: [
        {
          provide: PermissionsService,
          useValue: mockPermissionsService,
        },
      ],
    }).compile();

    controller = module.get<PermissionsController>(PermissionsController);
    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionDto: CreatePermissionDto = {
        name: 'Test Permission',
        apiPath: '/api/test',
        method: 'GET',
        module: 'test',
      };

      const expectedResult = new Types.ObjectId();
      mockPermissionsService.create.mockResolvedValue(expectedResult);

      const result = await controller.create(createPermissionDto, mockUser);

      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(
        createPermissionDto,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated permissions', async () => {
      const expectedResult = {
        meta: {
          current: 1,
          pageSize: 10,
          pages: 1,
          total: 1,
        },
        result: [
          {
            _id: new Types.ObjectId(),
            name: 'Test Permission',
            apiPath: '/api/test',
            method: 'GET',
            module: 'test',
          },
        ],
      };

      mockPermissionsService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll('1', '10', '');

      expect(result).toBe(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, '');
    });
  });

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const permissionId = new Types.ObjectId().toString();
      const expectedResult = {
        _id: new Types.ObjectId(permissionId),
        name: 'Test Permission',
        apiPath: '/api/test',
        method: 'GET',
        module: 'test',
      };

      mockPermissionsService.findOne.mockResolvedValue(expectedResult);

      const result = await controller.findOne(permissionId);

      expect(result).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(permissionId);
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const permissionId = new Types.ObjectId().toString();
      const updatePermissionDto: UpdatePermissionDto = {
        name: 'Updated Permission',
      };

      const expectedResult = { acknowledged: true, modifiedCount: 1 };
      mockPermissionsService.update.mockResolvedValue(expectedResult);

      const result = await controller.update(
        permissionId,
        updatePermissionDto,
        mockUser,
      );

      expect(result).toBe(expectedResult);
      expect(service.update).toHaveBeenCalledWith(
        permissionId,
        updatePermissionDto,
        mockUser,
      );
    });
  });

  describe('remove', () => {
    it('should remove a permission', async () => {
      const permissionId = new Types.ObjectId().toString();
      const expectedResult = { acknowledged: true, deletedCount: 1 };

      mockPermissionsService.remove.mockResolvedValue(expectedResult);

      const result = await controller.remove(permissionId, mockUser);

      expect(result).toBe(expectedResult);
      expect(service.remove).toHaveBeenCalledWith(permissionId, mockUser);
    });
  });
});
