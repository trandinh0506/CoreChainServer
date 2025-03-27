import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { WsService } from 'src/ws/ws.service';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly chatService: ChatService,
    private readonly wsService: WsService,
  ) {}
  afterInit(server: Server) {
    this.chatService.setServer(server);
  }
  handleConnection(client: Socket) {
    const namespace = client.nsp.name;
    console.log(`Client connected: ${client.id} to namespace: ${namespace}`);
    this.chatService.registerClient(client);
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.chatService.removeClient(client);
  }
  // conversation
  @SubscribeMessage('createConversation')
  create(@MessageBody() createConversationDto: CreateConversationDto) {
    return this.chatService.create(createConversationDto);
  }

  @SubscribeMessage('getConversationById')
  getById(@MessageBody() conversationId: string) {
    return this.chatService.getConversationById(conversationId);
  }

  @SubscribeMessage('getConversationByUserIdAndOtherId')
  getByUserIdAndOtherId(
    @MessageBody() data: { userId: string; otherId: string },
  ) {
    return this.chatService.getOrCreateDirectConversation(data);
  }
  @SubscribeMessage('getRecentConversations')
  getRecentConversations(
    @MessageBody() data: { userId: string; lastConversationId?: string },
  ) {
    return this.chatService.getRecentConversations(data);
  }

  // meessage
  @SubscribeMessage('sendMessage')
  sendMessage(@MessageBody() createMessageDto: CreateMessageDto) {
    return this.chatService.createMessage(createMessageDto);
  }

  @SubscribeMessage('findAllChat')
  findAll() {
    return this.chatService.findAll();
  }

  @SubscribeMessage('findOneChat')
  findOne(@MessageBody() id: number) {
    return this.chatService.findOne(id);
  }

  @SubscribeMessage('removeChat')
  remove(@MessageBody() id: number) {
    return this.chatService.remove(id);
  }
}
