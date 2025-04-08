import { Test, TestingModule } from '@nestjs/testing';
import { FeedbackService } from './feedback.service';
import { getModelToken } from '@nestjs/mongoose';
import { Feedback } from './schemas/feedback.schema';
import { SecurityService } from 'src/security/security.service';

describe('FeedbackService', () => {
  let service: FeedbackService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeedbackService,
        {
          provide: getModelToken(Feedback.name), // Inject model Mongoose
          useValue: {
            find: jest.fn().mockResolvedValue([]), // Mock find()
            create: jest.fn().mockResolvedValue({ _id: '1', name: 'HR' }),
          },
        },
        {
          provide: SecurityService,
          useValue: {
            encryptEmployeeId: jest.fn().mockReturnValue('encrypted-id'),
            decryptEmployeeId: jest.fn().mockReturnValue('decrypted-id'),
          },
        },
      ],
    }).compile();

    service = module.get<FeedbackService>(FeedbackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
