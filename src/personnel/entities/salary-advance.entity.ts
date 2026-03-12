import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('salary_advances')
export class SalaryAdvance {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @ManyToOne(() => User)
  employee: User;

  @Column({ type: 'float' })
  amount: number;

  @Column()
  reason: string;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ type: 'json', nullable: true })
  approvedBy: { _id: string; email: string } | string;

  @Column({ nullable: true })
  returnDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'json', nullable: true })
  createdBy: { _id: string; email: string };

  @Column({ type: 'json', nullable: true })
  updatedBy: { _id: string; email: string };

  @Column({ type: 'json', nullable: true })
  deletedBy: { _id: string; email: string };
}
