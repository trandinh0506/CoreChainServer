import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('contracts')
export class Contract {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  contractCode: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  file: string;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  status: string;

  @ManyToOne(() => User, { nullable: true })
  employee: User;

  @Column({ type: 'float', nullable: true })
  salary: number;

  @Column({ type: 'float', nullable: true })
  allowances: number;

  @Column({ nullable: true })
  insurance: string;

  @Column({ nullable: true })
  workingHours: number;

  @Column({ nullable: true })
  leavePolicy: string;

  @Column({ nullable: true })
  terminationTerms: string;

  @Column({ nullable: true })
  confidentialityClause: string;

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
