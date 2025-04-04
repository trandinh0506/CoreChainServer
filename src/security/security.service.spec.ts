import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';
import { ConfigService } from '@nestjs/config';
import { RsaService } from './rsa.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SecurityService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              switch (key) {
                case 'ENCRYPTION_KEY':
                  return 'test-encryption-key';
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: RsaService,
          useValue: {
            encrypt: jest.fn().mockReturnValue('encrypted-data'),
            decrypt: jest.fn().mockReturnValue('decrypted-data'),
          },
        },
      ],
    }).compile();

    service = module.get<SecurityService>(SecurityService);
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
