import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  encryptedEmployeeId: string;

  @Column()
  category: string;

  @Column({ default: false })
  isFlagged: boolean;

  @Column({ default: false })
  wasDecrypted: boolean;

  @Column({ nullable: true })
  decryptionReason: string;

  @Column({ type: 'json', nullable: true })
  decryptedBy: { _id: string; email: string };

  @Column({ nullable: true })
  approvedBy: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'json', nullable: true })
  deletedBy: { _id: string; email: string };
}
