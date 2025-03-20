"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    blockchain: {
        endpoint: process.env.BLOCKCHAIN_ENDPOINT,
        privateKey: process.env.PRIVATE_KEY,
        contractAddress: process.env.CONTRACT_ADDRESS,
    },
});
//# sourceMappingURL=configuration.js.map