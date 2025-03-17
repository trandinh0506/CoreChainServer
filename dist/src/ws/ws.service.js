"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WsService = void 0;
const common_1 = require("@nestjs/common");
let WsService = class WsService {
    constructor() {
        this.clients = new Map();
    }
    setServer(server) {
        this.server = server;
    }
    registerClient(client) {
        this.clients.set(client.id, client);
    }
    removeClient(client) {
        this.clients.delete(client.id);
    }
    emitToClient(clientId, event, data) {
        const client = this.clients.get(clientId);
        if (client) {
            client.emit(event, data);
        }
    }
    broadcast(event, data) {
        if (this.server) {
            this.server.emit(event, data);
        }
    }
};
exports.WsService = WsService;
exports.WsService = WsService = __decorate([
    (0, common_1.Injectable)()
], WsService);
//# sourceMappingURL=ws.service.js.map