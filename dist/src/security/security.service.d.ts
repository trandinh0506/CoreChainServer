import { ConfigService } from '@nestjs/config';
export declare class SecurityService {
    private configService;
    private secretKey;
    constructor(configService: ConfigService);
    encrypt(data: any): string;
    decrypt(ciphertext: any): any;
}
