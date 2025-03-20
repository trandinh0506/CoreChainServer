import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from './schemas/message.schema';
import { WsService } from 'src/ws/ws.service';
import { CreateMessageDto } from './dto/create-message.dto';

const CHAT_NAME_SPACE = '/chat';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private conversationModel: SoftDeleteModel<ConversationDocument>,
    @InjectModel(Message.name)
    private messageModel: SoftDeleteModel<MessageDocument>,
    private readonly wsService: WsService,
  ) {}
  async create(createConversationDto: CreateConversationDto) {
    const { participants, groupName, admin } = createConversationDto;

    // create conversation object with type any
    const conversationData: any = {
      participants,
    };

    // if group name is existing then add groupName and admin to conversation object
    if (groupName) {
      conversationData.groupName = groupName;
      conversationData.admin = admin;
    }

    // create conversation in DB
    return await this.conversationModel.create(conversationData);
  }
  async getOrCreateDirectConversation(userId: string, otherUserId: string) {
    // first direct message between user and other user
    const existingConversation = await this.conversationModel.findOne({
      participants: { $all: [userId, otherUserId] },
      groupName: { $exists: false },
    });

    // return if they already have a conversation
    if (existingConversation) {
      return existingConversation;
    }

    // if they don't have a conversation then create a conversation and return it
    const newConversation = await this.conversationModel.create({
      participants: [userId, otherUserId],
    });

    return newConversation;
  }

  async getConversationById(conversationId: string) {
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
      conversationId,
      senderId,
      content,
      attachments,
      readBy: [],
      createdAt: new Date(),
      isDeleted: false,
    });

    if (conversation.groupName) {
      // broadcast to room
      this.wsService.broadcastToRoom(
        CHAT_NAME_SPACE,
        conversationId, // TODO: projectId will be here
        'newMessage',
        newMessage,
      );
    } else {
      // if the conversation is direct message then reciverId is the remaining element in participants
      const receiverIds = conversation.participants.filter(
        (participant) => participant.toString() !== senderId,
      );

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
      // emit message to receiver
      this.wsService.emitToClient(
        CHAT_NAME_SPACE,
        receiverId,
        'newMessage',
        newMessage,
      );
    }

    return newMessage;
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
