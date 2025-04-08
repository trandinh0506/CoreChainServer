import { Test, TestingModule } from '@nestjs/testing';
import { PermissionsService } from './permissions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Permission } from './schemas/permission.schema';
import { BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { IUser } from 'src/users/users.interface';

describe('PermissionsService', () => {
  let service: PermissionsService;

  const mockUser: IUser = {
    _id: new Types.ObjectId().toString(),
    email: 'test@example.com',
    name: 'Test User',
    role: { _id: new Types.ObjectId().toString(), name: 'Admin' },
  };

  const mockPermissionModel = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    updateOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PermissionsService,
        {
          provide: getModelToken(Permission.name),
          useValue: mockPermissionModel,
        },
      ],
    }).compile();

    service = module.get<PermissionsService>(PermissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new permission', async () => {
      const createPermissionDto = {
        name: 'Test Permission',
        apiPath: '/api/test',
        method: 'GET',
        module: 'test',
      };

      const mockCreatedPermission = {
        _id: new Types.ObjectId(),
        ...createPermissionDto,
      };

      mockPermissionModel.findOne.mockResolvedValue(null);
      mockPermissionModel.create.mockResolvedValue(mockCreatedPermission);

      const result = await service.create(createPermissionDto, mockUser);

      expect(result).toBe(mockCreatedPermission._id);
      expect(mockPermissionModel.findOne).toHaveBeenCalledWith({
        apiPath: createPermissionDto.apiPath,
        method: createPermissionDto.method,
      });
      expect(mockPermissionModel.create).toHaveBeenCalledWith({
        ...createPermissionDto,
        createdBy: {
          _id: mockUser._id,
          email: mockUser.email,
        },
      });
    });

    it('should throw BadRequestException if permission already exists', async () => {
      const createPermissionDto = {
        name: 'Test Permission',
        apiPath: '/api/test',
        method: 'GET',
        module: 'test',
      };

      mockPermissionModel.findOne.mockResolvedValue({
        _id: new Types.ObjectId(),
      });

      await expect(
        service.create(createPermissionDto, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return paginated permissions', async () => {
      const mockPermissions = [
        {
          _id: new Types.ObjectId(),
          name: 'Test Permission',
          apiPath: '/api/test',
          method: 'GET',
          module: 'test',
        },
      ];

      mockPermissionModel.find.mockReturnValue({
        skip: jest.fn().mockReturnValue({
          limit: jest.fn().mockReturnValue({
            sort: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                select: jest.fn().mockReturnValue({
                  exec: jest.fn().mockResolvedValue(mockPermissions),
                }),
              }),
            }),
          }),
        }),
      });

      const result = await service.findAll(1, 10, '');

      expect(result.result).toEqual(mockPermissions);
      expect(result.meta).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('should return a single permission', async () => {
      const permissionId = new Types.ObjectId().toString();
      const mockPermission = {
        _id: new Types.ObjectId(permissionId),
        name: 'Test Permission',
        apiPath: '/api/test',
        method: 'GET',
        module: 'test',
      };

      mockPermissionModel.findOne.mockResolvedValue(mockPermission);

      const result = await service.findOne(permissionId);

      expect(result).toBe(mockPermission);
      expect(mockPermissionModel.findOne).toHaveBeenCalledWith({
        _id: permissionId,
      });
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a permission', async () => {
      const permissionId = new Types.ObjectId().toString();
      const updatePermissionDto = {
        name: 'Updated Permission',
      };

      const mockUpdateResult = { acknowledged: true, modifiedCount: 1 };
      mockPermissionModel.updateOne.mockResolvedValue(mockUpdateResult);

      const result = await service.update(
        permissionId,
        updatePermissionDto,
        mockUser,
      );

      expect(result).toBe(mockUpdateResult);
      expect(mockPermissionModel.updateOne).toHaveBeenCalledWith(
        { _id: permissionId },
        {
          ...updatePermissionDto,
          updatedBy: {
            _id: mockUser._id,
            email: mockUser.email,
          },
        },
      );
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(
        service.update('invalid-id', { name: 'Updated' }, mockUser),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a permission', async () => {
      const permissionId = new Types.ObjectId().toString();
      const mockDeleteResult = { acknowledged: true, deletedCount: 1 };

      mockPermissionModel.updateOne.mockResolvedValue({ acknowledged: true });
      mockPermissionModel.softDelete.mockResolvedValue(mockDeleteResult);

      const result = await service.remove(permissionId, mockUser);

      expect(result).toBe(mockDeleteResult);
      expect(mockPermissionModel.updateOne).toHaveBeenCalledWith(
        { _id: permissionId },
        {
          deletedBy: {
            _id: mockUser._id,
            email: mockUser.email,
          },
        },
      );
      expect(mockPermissionModel.softDelete).toHaveBeenCalledWith({
        _id: permissionId,
      });
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.remove('invalid-id', mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
