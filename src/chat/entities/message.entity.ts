import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Conversation } from './conversation.entity';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ManyToOne(() => Conversation)
  conversation: Conversation;

  // Storing as simple UUID string for querying easily
  @Column()
  conversationId: string;

  @ManyToOne(() => User)
  sender: User;

  // Storing as simple UUID string for querying easily
  @Column()
  senderId: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @Column({ type: 'json', nullable: true })
  readBy: { _id: string; name: string; avt: string }[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
