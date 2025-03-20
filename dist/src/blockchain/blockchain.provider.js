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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockchainProvider = void 0;
const web3_1 = __importDefault(require("web3"));
const ContractABI = __importStar(require("./build/contracts/EmployeeRegistry.json"));
const config_1 = require("@nestjs/config");
exports.BlockchainProvider = {
    provide: 'BLOCKCHAIN_PROVIDER',
    useFactory: async (configService) => {
        const web3 = new web3_1.default(configService.get('BLOCKCHAIN_ENDPOINT'));
        const privateKey = configService.get('PRIVATE_KEY');
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        web3.eth.accounts.wallet.add(account);
        const contractAddress = configService.get('CONTRACT_ADDRESS');
        const contract = new web3.eth.Contract(ContractABI.abi, contractAddress);
        return {
            web3,
            contract,
            account: account.address,
        };
    },
    inject: [config_1.ConfigService],
};
//# sourceMappingURL=blockchain.provider.js.map