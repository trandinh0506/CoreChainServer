import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Position } from './schemas/position.schema';

describe('PositionsController', () => {
  let controller: PositionsController;
  let service: PositionsService;

  const mockPositionModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    }),
    findOne: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PositionsController],
      providers: [
        PositionsService,
        {
          provide: getModelToken(Position.name),
          useValue: mockPositionModel,
        },
      ],
    }).compile();

    controller = module.get<PositionsController>(PositionsController);
    service = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new position', async () => {
      const createPositionDto = {
        title: 'Software Engineer',
        description: 'Developer position',
        level: 1,
        parentId: 'parent-id',
      };

      const mockUser = {
        _id: 'user-id',
        email: 'test@example.com',
      };

      const mockCreatedPosition = {
        _id: 'position-id',
        ...createPositionDto,
      };

      mockPositionModel.findOne.mockResolvedValueOnce(null);
      mockPositionModel.create.mockResolvedValueOnce(mockCreatedPosition);

      const result = await controller.create(
        createPositionDto,
        mockUser as any,
      );

      expect(result).toBe(mockCreatedPosition._id);
    });
  });

  describe('findAll', () => {
    it('should return paginated positions', async () => {
      const mockPositions = [
        { _id: '1', title: 'Position 1' },
        { _id: '2', title: 'Position 2' },
      ];

      mockPositionModel.find().exec.mockResolvedValueOnce(mockPositions);

      const result = await controller.findAll('1', '10', '');

      expect(result).toBeDefined();
      expect(result.result).toEqual(mockPositions);
    });
  });
});
