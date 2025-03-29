export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments: string[] = [];
  readBy: { _id: string; name: string; avatar: string };
  createdAt: Date;
}
