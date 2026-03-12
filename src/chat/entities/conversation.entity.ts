import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @Column({ nullable: true })
  groupName: string;

  @Column({ type: 'json', nullable: true })
  admin: { _id: string; name: string };

  @ManyToOne(() => User, { nullable: true })
  createdBy: User;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastActivity: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
