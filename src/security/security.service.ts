import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CryptoJS from 'crypto-js';
import crypto from 'crypto';
@Injectable()
export class SecurityService {
  private readonly secretKey: string;
  private readonly algorithm = 'aes-256-cbc';
  private readonly key: Buffer;
  private readonly iv: Buffer;

  constructor(private configService: ConfigService) {
    const secretKey = this.configService.get<string>('SECRET_KEY');
    if (!this.secretKey) {
      throw new Error('SECRET_KEY is not defined');
    }

    this.key = crypto.createHash('sha256').update(this.secretKey).digest();

    const ivString =
      this.configService.get<string>('ENCRYPTION_IV') || 'default-iv-vector';
    this.iv = crypto.createHash('md5').update(ivString).digest();
  }

  encryptEmployeeId(employeeId: string): string {
    const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
    let encrypted = cipher.update(employeeId, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  decryptEmployeeId(encryptedId: string, secretKey: string): string {
    if (secretKey !== this.secretKey) {
      return null;
    }
    const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
    let decrypted = decipher.update(encryptedId, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  encrypt(data: any) {
    const dataStr = typeof data === 'object' ? JSON.stringify(data) : data;

    const ciphertext = CryptoJS.AES.encrypt(dataStr, this.secretKey).toString();

    return ciphertext;
  }

  decrypt(ciphertext) {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

      try {
        return JSON.parse(decryptedData);
      } catch (e) {
        return decryptedData;
      }
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}
