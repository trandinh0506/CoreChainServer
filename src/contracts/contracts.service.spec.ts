import { Test, TestingModule } from '@nestjs/testing';
import { ContractsService } from './contracts.service';
import { getModelToken } from '@nestjs/mongoose';
import { Contract } from './schemas/contract.schema';

describe('ContractsService', () => {
  let service: ContractsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
        {
          provide: getModelToken(Contract.name), // Inject model Mongoose
          useValue: {
            find: jest.fn().mockResolvedValue([]), // Mock find()
            create: jest.fn().mockResolvedValue({ _id: '1', name: 'HR' }),
          },
        },
      ],
    }).compile();

    service = module.get<ContractsService>(ContractsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
