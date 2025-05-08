import { Injectable, Logger } from '@nestjs/common';
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
  constructor(private readonly configService: ConfigService) {
    this.privateKeyPath = path.join(process.cwd(), 'keys', 'private.pem');
    this.publicKeyPath = path.join(process.cwd(), 'keys', 'public.pem');
    this.initializeKeys();
  }

  private initializeKeys() {
    // Create keys directory if it doesn't exist
    // Load existing keys
    try {
      //Init private key
      const { RSA_PRIVATE_KEY } = JSON.parse(
        this.configService.get<string>('RSA_PRIVATE_KEY'),
      );
      this.privateKey = RSA_PRIVATE_KEY;
      //Init public key
      const { RSA_PUBLIC_KEY } = JSON.parse(
        this.configService.get<string>('RSA_PUBLIC_KEY'),
      );
      this.publicKey = RSA_PUBLIC_KEY;

      if (!this.privateKey) {
        this.readPrivateKeyFile();
      }
      if (!this.publicKey) {
        this.readPublicKeyFile();
      }
      if (!this.privateKey || !this.publicKey) {
        Logger.log('Cannot read RSA keys. Start generate key pair !');
        this.generateKeyFiles();
        // throw new Error('Cannot read RSA keys !');
      }
    } catch (error) {
      console.log('Error read keys: ', error);
    }
  }

  private readPrivateKeyFile() {
    try {
      this.privateKey = fs.readFileSync(this.privateKeyPath, 'utf8');
    } catch (error) {
      console.log(error);
    }
  }

  private readPublicKeyFile() {
    try {
      this.publicKey = fs.readFileSync(this.publicKeyPath, 'utf8');
    } catch (error) {
      console.log(error);
    }
  }

  generateKeyFiles() {
    Logger.log('RSA keys generating.....');

    const keysDir = path.join(process.cwd(), 'keys');
    if (!fs.existsSync(keysDir)) {
      fs.mkdirSync(keysDir);
    }

    const { privateKey, publicKey } = this.generateKeyPairRSA();

    if (privateKey) {
      fs.writeFileSync(
        this.privateKeyPath,
        Buffer.from(privateKey, 'base64').toString('utf-8'),
        { flag: 'w' },
      );
    }

    if (publicKey) {
      fs.writeFileSync(
        this.publicKeyPath,
        Buffer.from(publicKey, 'base64').toString('utf-8'),
        { flag: 'w' },
      );
    }

    Logger.log('RSA keys generated !');
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
    return { privateKey, publicKey };

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
