import { Test, TestingModule } from '@nestjs/testing';
import { SecurityController } from './security.controller';
import { SecurityService } from './security.service';
import { ConfigService } from '@nestjs/config';
import { RsaService } from './rsa.service';

describe('SecurityController', () => {
  let controller: SecurityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SecurityController],
      providers: [
        SecurityService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mock-encrypted-key'),
          },
        },
        {
          provide: RsaService,
          useValue: {
            decryptSecretKey: jest.fn().mockReturnValue('mock-secret-key'),
          },
        },
      ],
    }).compile();

    controller = module.get<SecurityController>(SecurityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
