import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { WsService } from 'src/ws/ws.service';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway {
  constructor(
    private readonly chatService: ChatService,
    private readonly wsService: WsService,
  ) {}

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
    @MessageBody() userId: string,
    @MessageBody() otherId: string,
  ) {
    return this.chatService.getOrCreateDirectConversation(userId, otherId);
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
