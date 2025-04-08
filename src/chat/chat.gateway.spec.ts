import { Test, TestingModule } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { getModelToken } from '@nestjs/mongoose';
import { Conversation } from './schemas/conversation.schema';
import { Message } from './schemas/message.schema';
import { WsService } from 'src/ws/ws.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let service: ChatService;

  const mockConversationModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      populate: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    }),
  };

  const mockMessageModel = {
    create: jest.fn(),
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([]),
    }),
    findOne: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    }),
  };

  const mockWsService = {
    broadcastToRoom: jest.fn(),
  };

  const mockJwtService = {
    verify: jest.fn().mockReturnValue({ _id: 'user-id' }),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue('test-secret'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatGateway,
        ChatService,
        {
          provide: getModelToken(Conversation.name),
          useValue: mockConversationModel,
        },
        {
          provide: getModelToken(Message.name),
          useValue: mockMessageModel,
        },
        {
          provide: WsService,
          useValue: mockWsService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    gateway = module.get<ChatGateway>(ChatGateway);
    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('getConversationById', () => {
    it('should return a conversation by id', async () => {
      const mockConversation = {
        _id: 'conv-id',
        participants: ['user1', 'user2'],
      };

      mockConversationModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValueOnce(mockConversation),
      });

      const result = await gateway.getById({ conversationId: 'conv-id' });
      expect(result).toEqual(mockConversation);
    });
  });

  describe('getRecentConversations', () => {
    it('should return recent conversations', async () => {
      const mockConversations = [
        {
          _id: new mongoose.Types.ObjectId(),
          participants: [
            new mongoose.Types.ObjectId(),
            new mongoose.Types.ObjectId(),
          ],
        },
      ];

      mockConversationModel
        .find()
        .sort({ lastActivity: -1 })
        .limit(10)
        .populate({ path: 'participants', select: 'name' })
        .exec.mockResolvedValueOnce(mockConversations);
      mockMessageModel.findOne().exec.mockResolvedValueOnce({
        content: 'test message',
      });

      const result = await gateway.getRecentConversations({
        userId: new mongoose.Types.ObjectId().toString(),
      });
      expect(result).toBeDefined();
    });
  });
});
