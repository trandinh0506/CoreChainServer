import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class RsaService {
  private readonly privateKeyPath: string;
  private readonly publicKeyPath: string;
  private privateKey: string;
  private publicKey: string;

  constructor(private configService: ConfigService) {
    this.privateKeyPath = path.join(process.cwd(), 'keys', 'private.pem');
    this.publicKeyPath = path.join(process.cwd(), 'keys', 'public.pem');
    this.initializeKeys();
  }

  private initializeKeys() {
    // Create keys directory if it doesn't exist
    const keysDir = path.join(process.cwd(), 'keys');
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir, { recursive: true });
    }

    // Generate new keys if they don't exist
    if (
      !fs.existsSync(this.privateKeyPath) ||
      !fs.existsSync(this.publicKeyPath)
    ) {
      this.generateKeyPair();
    }

    // Load existing keys
    this.privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
    this.publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
  }

  private generateKeyPair() {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    fs.writeFileSync(this.privateKeyPath, privateKey);
    fs.writeFileSync(this.publicKeyPath, publicKey);
  }

  encryptSecretKey(secretKey: string): string {
    const buffer = Buffer.from(secretKey, 'utf8');
    const encrypted = crypto.publicEncrypt(this.publicKey, buffer);
    return encrypted.toString('base64');
  }

  decryptSecretKey(encryptedSecretKey: string): string {
    const buffer = Buffer.from(encryptedSecretKey, 'base64');
    const decrypted = crypto.privateDecrypt(this.privateKey, buffer);
    return decrypted.toString('utf8');
  }
}
