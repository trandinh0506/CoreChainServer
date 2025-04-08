import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';
import { ConfigService } from '@nestjs/config';
import { RsaService } from './rsa.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    process.env.ENCRYPTED_SECRET_KEY = 'mock-encrypted-key';
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<SecurityService>(SecurityService);
  });

  afterEach(() => {
    delete process.env.ENCRYPTED_SECRET_KEY;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encrypt', () => {
    it('should encrypt data', () => {
      const result = service.encrypt('test-data');
      expect(result).toBeDefined();
    });
  });

  describe('decrypt', () => {
    it('should decrypt data', () => {
      const result = service.decrypt('encrypted-data');
      expect(result).toBeDefined();
    });
  });
});
