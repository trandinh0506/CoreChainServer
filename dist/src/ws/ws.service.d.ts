import { Server, Socket } from 'socket.io';
export declare class WsService {
    private server;
    private clients;
    setServer(server: Server): void;
    registerClient(client: Socket): void;
    removeClient(client: Socket): void;
    emitToClient(clientId: string, event: string, data: any): void;
    broadcast(event: string, data: any): void;
}
