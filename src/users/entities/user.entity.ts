import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne } from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Department } from '../../departments/entities/department.entity';
import { Position } from '../../positions/entities/position.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  password?: string;

  @ManyToOne(() => Role)
  role: Role;

  @ManyToOne(() => Department)
  department: Department;

  @Column({ nullable: true })
  txHash: string;

  @Column({ type: 'float', default: 0 })
  workingHours: number;

  @Column({ type: 'longtext', nullable: true })
  refreshToken: string;

  @Column({ type: 'float', default: 0 })
  kpi: number;

  @Column({ type: 'float', default: 0 })
  dayOff: number;

  @Column({ nullable: true })
  employeeId: string;

  @ManyToOne(() => Position)
  position: Position;

  @Column({ nullable: true })
  fcmToken: string;

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
