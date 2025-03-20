"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const web3_1 = __importDefault(require("web3"));
const EmployeeRegistryArtifact = __importStar(require("./build/contracts/EmployeeRegistry.json"));
const security_service_1 = require("../security/security.service");
let BlockchainService = class BlockchainService {
    constructor(configService, securityService, blockchainProvider) {
        this.configService = configService;
        this.securityService = securityService;
        this.blockchainProvider = blockchainProvider;
    }
    async onModuleInit() {
        try {
            this.web3 = new web3_1.default(this.configService.get('BLOCKCHAIN_ENDPOINT', 'http://localhost:7545'));
            const privateKey = this.configService.get('PRIVATE_KEY');
            if (privateKey) {
                const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
                this.web3.eth.accounts.wallet.add(account);
                this.account = account.address;
            }
            else {
                const accounts = await this.web3.eth.getAccounts();
                this.account = accounts[0];
            }
            const contractAddress = this.configService.get('CONTRACT_ADDRESS');
            this.employeeRegistry = new this.web3.eth.Contract(EmployeeRegistryArtifact.abi, contractAddress);
            common_1.Logger.log('Blockchain service initialized successfully with Sepolia');
        }
        catch (error) {
            common_1.Logger.error('Failed to initialize blockchain service:', error);
        }
    }
    async getBalance(address) {
        const web3 = this.blockchainProvider.web3;
        const balance = await web3.eth.getBalance(address);
        return web3.utils.fromWei(balance, 'ether');
    }
    async callContractMethod(methodName, ...args) {
        const contract = this.blockchainProvider.contract;
        return contract.methods[methodName](...args).call();
    }
    async executeContractMethod(methodName, ...args) {
        const contract = this.blockchainProvider.contract;
        const account = this.blockchainProvider.account;
        const tx = contract.methods[methodName](...args);
        const gas = await tx.estimateGas({ from: account });
        return tx.send({
            from: account,
            gas,
        });
    }
    async addEmployee(employeeData) {
        try {
            const encryptedData = this.securityService.encrypt(employeeData);
            const result = await this.employeeRegistry.methods
                .addEmployee(employeeData.employeeId, encryptedData)
                .send({ from: this.account, gas: 1000000 });
            return result.transactionHash;
        }
        catch (error) {
            console.error('Error adding employee to blockchain:', error);
            throw error;
        }
    }
    async updateEmployee(employeeData) {
        try {
            const encryptedData = this.securityService.encrypt(employeeData);
            const result = await this.employeeRegistry.methods
                .updateEmployee(employeeData.employeeId, encryptedData)
                .send({ from: this.account, gas: 1000000 });
            return result.transactionHash;
        }
        catch (error) {
            console.error('Error updating employee on blockchain:', error);
            if (error.message.includes('Employee is not active')) {
                throw new common_1.BadRequestException('Cannot update an inactive employee.');
            }
            else {
                throw new common_1.InternalServerErrorException('Blockchain transaction failed.');
            }
        }
    }
    async deactivateEmployee(employeeId) {
        try {
            const result = await this.employeeRegistry.methods
                .deactivateEmployee(employeeId)
                .send({ from: this.account, gas: 1000000 });
            return result.transactionHash;
        }
        catch (error) {
            console.error('Error deactivating employee on blockchain:', error);
            throw error;
        }
    }
    async getEmployee(employeeId) {
        try {
            const employee = (await this.employeeRegistry.methods
                .getEmployee(employeeId)
                .call());
            const [id, encryptedData, timestamp, isActive] = Object.values(employee);
            console.log(id, encryptedData, timestamp, isActive);
            const employeeData = this.securityService.decrypt(this.securityService.decrypt(encryptedData).encryptedData);
            return {
                ...employeeData,
                timestamp: new Date(Number(timestamp) * 1000),
                isActive,
            };
        }
        catch (error) {
            console.error('Error getting employee from blockchain:', error);
            throw error;
        }
    }
    async getAllEmployeeIds() {
        try {
            return await this.employeeRegistry.methods.getAllEmployeeIds().call();
        }
        catch (error) {
            console.error('Error getting all employee IDs from blockchain:', error);
            throw error;
        }
    }
};
exports.BlockchainService = BlockchainService;
exports.BlockchainService = BlockchainService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('BLOCKCHAIN_PROVIDER')),
    __metadata("design:paramtypes", [config_1.ConfigService,
        security_service_1.SecurityService, Object])
], BlockchainService);
//# sourceMappingURL=blockchain.service.js.map