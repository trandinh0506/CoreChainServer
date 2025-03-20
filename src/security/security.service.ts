import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CryptoJS from 'crypto-js';

@Injectable()
export class SecurityService {
  private secretKey: string;
  constructor(private configService: ConfigService) {
    this.secretKey = this.configService.get<string>('SECRET_KEY');
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
