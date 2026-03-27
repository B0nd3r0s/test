import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Candidate } from '../candidates/candidate.entity';

export enum VacancyStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  DRAFT = 'draft',
}

@Entity('vacancies')
export class Vacancy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hhVacancyId: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  requirements?: string;

  @Column({ nullable: true })
  conditions?: string;

  @Column({ nullable: true })
  salaryFrom?: number;

  @Column({ nullable: true })
  salaryTo?: number;

  @Column({ nullable: true })
  currency?: string;

  @Column({ type: 'enum', enum: VacancyStatus, default: VacancyStatus.ACTIVE })
  status: VacancyStatus;

  @ManyToOne(() => User, (user) => user.vacancies)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @Column()
  ownerId: string;

  @OneToMany(() => Candidate, (candidate) => candidate.vacancy)
  candidates: Candidate[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
