// all gateways handle
import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WsService } from './ws.service';

@WebSocketGateway({
  namespace: '/',
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
})
export class WsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly wsService: WsService) {}

  afterInit(server: Server) {
    this.wsService.setServer(server);
  }

  handleConnection(client: Socket) {
    const namespace = client.nsp.name;
    console.log(`Client connected: ${client.id} to namespace: ${namespace}`);
    this.wsService.registerClient(client, namespace);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.wsService.removeClient(client);
  }
}
