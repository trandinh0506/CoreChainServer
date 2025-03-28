import { JwtService } from '@nestjs/jwt';
import { Injectable, NotFoundException, Get } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import {
  Conversation,
  ConversationDocument,
  ConversationPopulatedDocument,
  PopulatedUser,
} from './schemas/conversation.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { WsService } from 'src/ws/ws.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ConversationItem } from './declarations/conversationItem';
import { Types } from 'mongoose';
import { Server, Socket } from 'socket.io';
import { IUser } from 'src/users/users.interface';
import { ConfigService } from '@nestjs/config';

const CHAT_NAME_SPACE = '/chat';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: SoftDeleteModel<ConversationDocument>,
    @InjectModel(Message.name)
    private messageModel: SoftDeleteModel<MessageDocument>,
    private readonly wsService: WsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  private server: Server;
  private clients: Map<string, Socket> = new Map();

  setServer(server: Server) {
    this.server = server;
  }

  /** register client base on their namespace {namespace: {clientId: client}} */
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
      // Attach user info to the client
      client['user'] = payload;

      console.log('Client authenticated:', client.id);
      this.clients.set(payload._id, client);
    } catch (error) {
      console.log('Invalid token. Disconnecting client:', client.id);
      return client.disconnect();
    }
  }

  removeClient(client: Socket) {}

  /**  */
  emitToClient(clientId: string, event: string, data: any) {
    const client = this.clients.get(clientId);
    if (!client) {
      return;
    }
    client.emit(event, data);
  }

  /**  */
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

    // Convert participants thành ObjectId[]
    const conversationData: any = {
      participants: participants.map((id) => new Types.ObjectId(id)),
    };

    if (groupName) {
      conversationData.groupName = groupName;
      conversationData.admin = {
        _id: new Types.ObjectId(admin._id),
        name: admin.name,
      };
    }

    return await this.conversationModel.create(conversationData);
  }
  async getOrCreateDirectConversation({
    userId,
    otherId,
  }: {
    userId: string;
    otherId: string;
  }) {
    // convert id to object id
    const userObjectId = new Types.ObjectId(userId);
    const otherObjectId = new Types.ObjectId(otherId);
    // first direct message between user and other user
    const existingConversation = await this.conversationModel.findOne({
      participants: { $all: [userObjectId, otherObjectId] },
      groupName: { $exists: false },
    });

    // return if they already have a conversation
    if (existingConversation) {
      return existingConversation;
    }

    // if they don't have a conversation then create a conversation and return it
    const newConversation = await this.conversationModel.create({
      participants: [userObjectId, otherObjectId],
    });

    return newConversation;
  }

  async getConversationById({ conversationId }: { conversationId: string }) {
    const conversation = await this.conversationModel
      .findById(conversationId)
      .exec();
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
    // filter conversation that this user joined
    const filter: any = { participants: new Types.ObjectId(userId) };

    // if lastConversationId is provided then find last conversation to get last activity
    if (lastConversationId) {
      const lastConversation = await this.conversationModel
        .findById(lastConversationId)
        .exec();
      if (lastConversation) {
        filter.lastActivity = { $lt: lastConversation.lastActivity };
      }
    }

    // find 10 conversations sorted by lastActivity descending
    const conversations = (await this.conversationModel
      .find(filter)
      .sort({ lastActivity: -1 })
      .limit(10)
      .populate({ path: 'participants', select: 'name' })
      .exec()) as ConversationPopulatedDocument[];
    // Mapping data into type of ConversationItem
    const conversationItems: ConversationItem[] = await Promise.all(
      conversations.map(async (conv) => {
        // find latest message
        const latestMsgDoc = await this.messageModel
          .findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .exec();
        let name = '';
        let avatar = '';
        // if group => display groupName
        if (conv.groupName) {
          name = conv.groupName;
          avatar = 'https://picsum.photos/200'; // url for development only
        } else {
          // if direct message => get the other name
          // by populated participants with users collection we can access participant.name

          const otherParticipant = conv.participants.find(
            (p: PopulatedUser) => p._id.toString() !== userId,
          );
          if (otherParticipant) {
            name = otherParticipant.name;
            avatar = 'https://picsum.photos/200'; // url for development only
          }
        }
        return {
          id: conv._id.toString(),
          avatar,
          name,
          timestamp:
            conv.lastActivity?.toISOString() || new Date().toISOString(),
          latestMessage: latestMsgDoc?.content || '',
          isTyping: false, // TODO: implement this
          unreadCount: 0, // TODO: implement this
        };
      }),
    );

    return conversationItems;
  }

  // message
  async createMessage(createMessageDto: CreateMessageDto) {
    const { conversationId, senderId, content, attachments } = createMessageDto;

    const conversation = await this.conversationModel.findById(conversationId);
    if (!conversation) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found.`,
      );
    }

    const newMessage = await this.messageModel.create({
      conversationId: new Types.ObjectId(conversationId),
      senderId: new Types.ObjectId(senderId),
      content,
      attachments,
      readBy: [],
      createdAt: new Date(),
      isDeleted: false,
    });

    // update last message
    conversation.lastActivity = new Date();
    await conversation.save();

    if (conversation.groupName) {
      // broadcast to room
      this.wsService.broadcastToRoom(
        CHAT_NAME_SPACE,
        conversationId,
        'newMessage',
        newMessage,
      );
    } else {
      // if the conversation is direct message then reciverId is the remaining element in participants
      const receiverIds = conversation.participants
        .filter((participant) => participant.toString() !== senderId)
        .map((id) => id.toString());

      if (receiverIds.length !== 1) {
        console.error(
          'Direct message error - Expected exactly 1 receiver, got:',
          { receiverIds },
        );
        throw new Error(
          'Invalid conversation participants for direct message.',
        );
      }

      const receiverId = receiverIds[0].toString();
      console.log(receiverId);
      // emit message to receiver
      console.log();
      this.emitToClient(receiverId, 'newMessage', newMessage);
    }

    return newMessage;
  }

  async getMessages({
    conversationId,
    lastMessageId,
  }: {
    conversationId: string;
    lastMessageId?: string;
  }): Promise<Message[]> {
    // Xây dựng bộ lọc: conversationId phải khớp
    const filter: any = { conversationId: new Types.ObjectId(conversationId) };

    // Nếu có lastMessageId, tìm tin nhắn đó để lấy thời gian tạo và lọc các tin nhắn cũ hơn
    if (lastMessageId) {
      const lastMessage = await this.messageModel
        .findById(lastMessageId)
        .exec();
      if (lastMessage) {
        filter.createdAt = { $lt: lastMessage.createdAt };
      }
    }

    // Tìm 10 tin nhắn, sắp xếp theo createdAt giảm dần (tin mới nhất trước)
    const messages = await this.messageModel
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();

    return messages;
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
