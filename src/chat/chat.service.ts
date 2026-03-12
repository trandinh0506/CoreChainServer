import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException, Get } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { WsService } from 'src/ws/ws.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationItem } from './declarations/conversationItem';
import { Server, Socket } from 'socket.io';
import { IUser } from 'src/users/users.interface';
import { ConfigService } from '@nestjs/config';

const CHAT_NAME_SPACE = '/chat';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly wsService: WsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private server: Server;
  private clients: Map<string, Socket> = new Map();

  setServer(server: Server) {
    this.server = server;
  }

  registerClient(client: Socket) {
    const token =
      client.handshake.auth?.token ||
      client.handshake.headers?.authorization?.split(' ')[1];

    if (!token) {
      console.log('Missing token. Disconnecting client:', client.id);
      return client.disconnect();
    }

    try {
      const secret = this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET');
      const payload: IUser = this.jwtService.verify(token, {
        secret,
        ignoreExpiration: false,
      });
      client['user'] = payload;

      console.log('Client authenticated:', client.id);
      this.clients.set(payload._id.toString(), client); // Ensure _id is string
    } catch (error) {
      console.log('Invalid token. Disconnecting client:', client.id);
      return client.disconnect();
    }
  }

  removeClient(client: Socket) {}

  emitToClient(clientId: string, event: string, data: any) {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }
    client.emit(event, data);
  }

  joinRoom(client: Socket, room: string) {
    client.join(room);
  }

  leaveRoom(client: Socket, room: string) {
    client.leave(room);
  }

  // broadcast to a room base on their namespace
  broadcastToRoom(room: string, event: string, data: any) {}
  
  async create(createConversationDto: CreateConversationDto) {
    const { participants, groupName, admin } = createConversationDto;

    // Convert participants to string
    const conversationData: any = {
      participants: participants.map((id) => ({ _id: id.toString() })),
    };

    if (groupName) {
      conversationData.groupName = groupName;
      conversationData.admin = {
        _id: admin._id.toString(),
        name: admin.name,
      };
    }

    const newConv = this.conversationRepository.create(conversationData);
    return await this.conversationRepository.save(newConv);
  }
  
  async getOrCreateDirectConversation({
    userId,
    otherId,
  }: {
    userId: string;
    otherId: string;
  }) {
    // Requires a query builder to find conversations with exact participants
    const qb = this.conversationRepository.createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .where('conversation.groupName IS NULL');
      
    const conversations = await qb.getMany();
    
    // In-memory filter for exactly those two participants
    const existingConversation = conversations.find(c => {
      const pIds = c.participants.map(p => p._id);
      return pIds.includes(userId) && pIds.includes(otherId) && pIds.length === 2;
    });

    if (existingConversation) {
      return existingConversation;
    }

    const newConversation = this.conversationRepository.create({
      participants: [{ _id: userId } as any, { _id: otherId } as any],
    });

    return await this.conversationRepository.save(newConversation);
  }

  async getConversationById({ conversationId }: { conversationId: string }) {
    const conversation = await this.conversationRepository.findOne({ where: { _id: conversationId }, relations: ['participants'] });
    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found.`,
      );
    }
    return conversation;
  }

  async getRecentConversations({
    userId,
    lastConversationId,
  }: {
    userId: string;
    lastConversationId?: string;
  }): Promise<ConversationItem[]> {
    
    let lastActivityFilter = null;
    if (lastConversationId) {
      const lastConv = await this.conversationRepository.findOne({ where: { _id: lastConversationId } });
      if (lastConv) lastActivityFilter = lastConv.lastActivity;
    }

    const qb = this.conversationRepository.createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.participants', 'participant')
      .where('participant._id = :userId', { userId })
      .orderBy('conversation.lastActivity', 'DESC')
      .take(10);

    if (lastActivityFilter) {
      qb.andWhere('conversation.lastActivity < :lastActivity', { lastActivity: lastActivityFilter });
    }

    const conversations = await qb.getMany();

    const conversationItems: ConversationItem[] = await Promise.all(
      conversations.map(async (conv) => {
        const latestMsgDoc = await this.messageRepository.findOne({
          where: { conversationId: conv._id, isDeleted: false },
          order: { createdAt: 'DESC' }
        });

        let name = '';
        let avatar = '';

        if (conv.groupName) {
          name = conv.groupName;
          avatar = 'https://picsum.photos/200';
        } else {
          const otherParticipant = conv.participants.find(
            (p) => p._id !== userId,
          );
          if (otherParticipant) {
            name = otherParticipant.name;
            avatar = 'https://picsum.photos/200';
          }
        }
        return {
          id: conv._id,
          avatar,
          name,
          timestamp:
            conv.lastActivity?.toISOString() || new Date().toISOString(),
          latestMessage: latestMsgDoc?.content || '',
          isTyping: false,
          unreadCount: 0,
        };
      }),
    );

    return conversationItems;
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    const { conversationId, senderId, content, attachments } = createMessageDto;

    const conversation = await this.conversationRepository.findOne({ where: { _id: conversationId }, relations: ['participants'] });
    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found.`,
      );
    }

    const newMessage = this.messageRepository.create({
      conversationId: conversationId.toString(),
      senderId: senderId.toString(),
      content,
      attachments,
      readBy: [],
      createdAt: new Date(),
      isDeleted: false,
    });
    
    const savedMsg = await this.messageRepository.save(newMessage);

    conversation.lastActivity = new Date();
    await this.conversationRepository.save(conversation);

    if (conversation.groupName) {
      this.wsService.broadcastToRoom(
        CHAT_NAME_SPACE,
        conversationId,
        'newMessage',
        savedMsg,
      );
    } else {
      const receiverIds = conversation.participants
        .filter((participant) => participant._id !== senderId)
        .map((p) => p._id);

      if (receiverIds.length !== 1) {
        console.error(
          'Direct message error - Expected exactly 1 receiver, got:',
          { receiverIds },
        );
      } else {
        const receiverId = receiverIds[0];
        this.emitToClient(receiverId, 'newMessage', savedMsg);
      }
    }

    return savedMsg;
  }

  async getMessages({
    conversationId,
    lastMessageId,
  }: {
    conversationId: string;
    lastMessageId?: string;
  }): Promise<Message[]> {
    
    let lastMsgFilter = null;
    if (lastMessageId) {
       const last = await this.messageRepository.findOne({ where: { _id: lastMessageId } });
       if (last) lastMsgFilter = last.createdAt;
    }

    const qb = this.messageRepository.createQueryBuilder('message')
      .where('message.conversationId = :cid', { cid: conversationId })
      .andWhere('message.isDeleted = false')
      .orderBy('message.createdAt', 'DESC')
      .take(10);
      
    if (lastMsgFilter) {
      qb.andWhere('message.createdAt < :lastAt', { lastAt: lastMsgFilter });
    }

    return await qb.getMany();
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
