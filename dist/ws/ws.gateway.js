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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const ws_service_1 = require("./ws.service");
let WsGateway = class WsGateway {
    constructor(wsService) {
        this.wsService = wsService;
    }
    afterInit(server) {
        this.wsService.setServer(server);
    }
    handleConnection(client) {
        console.log(`Client connected: ${client.id}`);
        this.wsService.registerClient(client);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
        this.wsService.removeClient(client);
    }
};
exports.WsGateway = WsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WsGateway.prototype, "server", void 0);
exports.WsGateway = WsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __metadata("design:paramtypes", [ws_service_1.WsService])
], WsGateway);
//# sourceMappingURL=ws.gateway.js.map