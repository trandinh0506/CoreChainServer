import { ConfigService } from '@nestjs/config';
import { RsaService } from './security/rsa.service';

async function encryptSecret() {
  const configService = new ConfigService();
  const rsaService = new RsaService(configService);

  const secretKey = configService.get<string>('SECRET_KEY');
  console.log(secretKey);
  if (!secretKey) {
    console.error('SECRET_KEY is not defined in .env file');
    process.exit(1);
  }
  // generate rsa keys before encrypt secret key
  // rsaService.generateKeyFiles();
  const encryptedSecretKey = rsaService.encryptSecretKey(secretKey);
  console.log('Encrypted SECRET_KEY:');
  console.log(encryptedSecretKey);
  console.log('\nAdd this to your .env file as:');
  console.log(`ENCRYPTED_SECRET_KEY=${encryptedSecretKey}`);
}

encryptSecret();
