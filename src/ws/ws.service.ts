import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WsService {
  private server: Server;
  private clients: Map<string, Map<string, Socket>> = new Map();

  setServer(server: Server) {
    this.server = server;
  }

  /** register client base on their namespace {namespace: {clientId: client}} */
  registerClient(client: Socket, namespace: string) {
    console.log('registerClient', client, namespace);
    if (!this.clients.has(namespace)) {
      this.clients.set(namespace, new Map());
    }
    this.clients.get(namespace).set(client.id, client);
    console.log({ clients: this.clients });
  }

  removeClient(client: Socket) {
    const namespace = client.nsp.name;
    if (this.clients.has(namespace)) {
      this.clients.get(namespace).delete(client.id);
      if (this.clients.get(namespace).size === 0) {
        this.clients.delete(namespace);
      }
    }
  }

  /**  */
  emitToClient(namespace: string, clientId: string, event: string, data: any) {
    const client = this.clients.get(namespace)?.get(clientId);
    if (client) {
      client.emit(event, data);
    }
  }

  /** broadcast to a namespace*/
  broadcastToNamespace(namespace: string, event: string, data: any) {
    if (this.server) {
      this.server.of(namespace).emit(event, data);
    }
  }

  /**  */
  joinRoom(client: Socket, room: string) {
    client.join(room);
  }

  leaveRoom(client: Socket, room: string) {
    client.leave(room);
  }

  // broadcast to a room base on their namespace
  broadcastToRoom(namespace: string, room: string, event: string, data: any) {
    if (this.server) {
      this.server.of(namespace).to(room).emit(event, data);
    }
  }
}
