import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';
export declare class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly wsService;
    server: Server;
    constructor(wsService: WsService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
