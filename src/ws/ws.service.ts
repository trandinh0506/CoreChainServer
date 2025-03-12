import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WsService {
  private server: Server;
  private clients: Map<string, Socket> = new Map();

  setServer(server: Server) {
    this.server = server;
  }

  registerClient(client: Socket) {
    this.clients.set(client.id, client);
  }

  removeClient(client: Socket) {
    this.clients.delete(client.id);
  }

  emitToClient(clientId: string, event: string, data: any) {
    const client = this.clients.get(clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  broadcast(event: string, data: any) {
    if (this.server) {
      this.server.emit(event, data);
    }
  }
}
