import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  _id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'json', nullable: true })
  attachments: string[];

  @ManyToOne(() => Department)
  department: Department;

  @ManyToOne(() => User)
  manager: User;

  @ManyToMany(() => User)
  @JoinTable()
  teamMembers: User[];

  @ManyToMany(() => Task)
  @JoinTable()
  tasks: Task[];

  @Column({ type: 'json', nullable: true })
  expenses: { cost: number; reason: string }[];

  @Column({ type: 'float', default: 0 })
  revenue: number;

  @Column({ default: 0 })
  priority: number;

  @Column({ default: 0 })
  status: number;

  @Column({ default: 0 })
  progress: number;

  @Column({ nullable: true })
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  actualEndDate: Date;

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
