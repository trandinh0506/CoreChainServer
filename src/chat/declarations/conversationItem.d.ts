export interface ConversationItem {
  id: string;
  avatar: string;
  name: string;
  timestamp: string;
  latestMessage: string;
  isTyping: boolean;
  unreadCount: number;
}
