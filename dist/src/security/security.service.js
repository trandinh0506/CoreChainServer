"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const crypto_js_1 = __importDefault(require("crypto-js"));
let SecurityService = class SecurityService {
    constructor(configService) {
        this.configService = configService;
        this.secretKey = this.configService.get('SECRET_KEY');
    }
    encrypt(data) {
        const dataStr = typeof data === 'object' ? JSON.stringify(data) : data;
        const ciphertext = crypto_js_1.default.AES.encrypt(dataStr, this.secretKey).toString();
        return ciphertext;
    }
    decrypt(ciphertext) {
        try {
            const bytes = crypto_js_1.default.AES.decrypt(ciphertext, this.secretKey);
            const decryptedData = bytes.toString(crypto_js_1.default.enc.Utf8);
            try {
                return JSON.parse(decryptedData);
            }
            catch (e) {
                return decryptedData;
            }
        }
        catch (error) {
            console.error('Decryption error:', error);
            throw new Error('Failed to decrypt data');
        }
    }
};
exports.SecurityService = SecurityService;
exports.SecurityService = SecurityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SecurityService);
//# sourceMappingURL=security.service.js.map