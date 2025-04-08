import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Position } from './schemas/position.schema';

describe('PositionsService', () => {
  let service: PositionsService;

  const mockPositionModel = {
    find: jest.fn().mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsService,
        {
          provide: getModelToken(Position.name),
          useValue: mockPositionModel,
        },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated positions', async () => {
      const result = await service.findAll(1, 10, '');
      expect(result).toBeDefined();
      expect(mockPositionModel.find).toHaveBeenCalled();
    });
  });
});
