import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackController } from './feedback.controller';
import { FeedbackService } from './feedback.service';
import { getModelToken } from '@nestjs/mongoose';
import { Feedback } from './schemas/feedback.schema';
import { SecurityService } from 'src/security/security.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { IFeedback } from './feedback.interface';
import mongoose, { Types } from 'mongoose';

describe('FeedbackController', () => {
  let controller: FeedbackController;
  let service: FeedbackService;

  const mockFeedbackModel = {
    find: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue({ _id: new mongoose.Types.ObjectId() }),
    findById: jest.fn().mockResolvedValue(null),
    updateOne: jest.fn().mockResolvedValue({}),
    softDelete: jest.fn().mockResolvedValue({}),
  };

  const mockSecurityService = {
    encryptEmployeeId: jest.fn().mockReturnValue('encrypted-id'),
    decryptEmployeeId: jest.fn().mockReturnValue('decrypted-id'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeedbackController],
      providers: [
        FeedbackService,
        {
          provide: getModelToken(Feedback.name),
          useValue: mockFeedbackModel,
        },
        {
          provide: SecurityService,
          useValue: mockSecurityService,
        },
      ],
    }).compile();

    controller = module.get<FeedbackController>(FeedbackController);
    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add test cases for controller methods
  describe('createFeedback', () => {
    it('should create a new feedback', async () => {
      const mockObjectId = new mongoose.Types.ObjectId();
      const createFeedbackDto: CreateFeedbackDto = {
        sender: '67e342fdb0a106147b7bcd66',
        category: 'general',
        title: 'Test Feedback',
        content: 'This is a test feedback',
      };

      jest.spyOn(service, 'createFeedback').mockResolvedValue(mockObjectId);

      const result = await controller.create(createFeedbackDto);
      expect(result).toBeDefined();
      expect(service.createFeedback).toHaveBeenCalledWith(createFeedbackDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated feedback list', async () => {
      const mockFeedback: IFeedback = {
        _id: new mongoose.Types.ObjectId(),
        encryptedEmployeeId: 'encrypted-id',
        category: 'general',
        title: 'Test Feedback',
        content: 'Test content',
        isFlagged: false,
        wasDecrypted: false,
        decryptionReason: null,
        decryptedBy: null,
        approvedBy: null,
        isDeleted: false,
        deletedAt: null,
        createdAt: new Date(),
        deletedBy: null,
      };

      const mockResult = {
        meta: {
          current: 1,
          pageSize: 10,
          pages: 1,
          total: 1,
        },
        result: [mockFeedback],
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(mockResult);

      const result = await controller.findAll('1', '10', '');
      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith(1, 10, '');
    });
  });
});
