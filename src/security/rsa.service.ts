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
    // Load existing keys
    this.privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
    this.publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');

    if (!this.privateKey || !this.publicKey) {
      this.initKeyFiles();
    }
    // this.privateKey = this.configService.get<string>('RSA_PRIVATE_KEY');
    // this.publicKey = this.configService.get<string>('RSA_PUBLIC_KEY');
    // console.log(this.privateKeyPath);
    // console.log(this.publicKeyPath);
    // console.log(this.privateKey);
    // console.log(this.publicKey);
  }

  private initKeyFiles() {
    const keysDir = path.join(process.cwd(), 'keys');
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir);
    }

    const privateKey = this.configService.get<string>('RSA_PRIVATE_KEY');
    const publicKey = this.configService.get<string>('RSA_PUBLIC_KEY');

    if (!privateKey && !publicKey) {
      this.generateKeyPairRSA();
      return;
    }

    if (privateKey) {
      fs.writeFileSync(
        path.join(keysDir, 'private.pem'),
        Buffer.from(privateKey, 'base64').toString('utf-8'),
        { flag: 'w' },
      );
    }

    if (publicKey) {
      fs.writeFileSync(
        path.join(keysDir, 'public.pem'),
        Buffer.from(publicKey, 'base64').toString('utf-8'),
        { flag: 'w' },
      );
    }
  }

  private generateKeyPairRSA() {
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

    // Encrypt secret key and save to .env file
    // will be implemented after considering security capabilities

    // const secretKey = this.configService.get<string>('SECRET_KEY');
    // const encryptedSecretKey = this.encryptSecretKey(secretKey);
    // this.configService.set('ENCRYPTED_SECRET_KEY', encryptedSecretKey);
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
