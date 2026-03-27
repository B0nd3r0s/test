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
import { Vacancy } from '../vacancies/vacancy.entity';
import { Message } from '../messages/message.entity';
import { Resume } from '../resumes/resume.entity';

export enum CandidateStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  INTERVIEW = 'interview',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
}

export enum ContactChannel {
  HH = 'hh',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
}

@Entity('candidates')
export class Candidate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  hhResumeId?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  telegramId?: string;

  @Column({ nullable: true })
  whatsappNumber?: string;

  @Column({ type: 'text', nullable: true })
  summary?: string;

  @Column({ type: 'jsonb', nullable: true })
  skills?: string[];

  @Column({ nullable: true })
  experienceYears?: number;

  @Column({ type: 'int', default: 0 })
  score?: number;

  @Column({ type: 'text', nullable: true })
  scoreExplanation?: string;

  @Column({ type: 'enum', enum: CandidateStatus, default: CandidateStatus.NEW })
  status: CandidateStatus;

  @Column({ type: 'enum', enum: ContactChannel, default: ContactChannel.HH })
  preferredChannel: ContactChannel;

  @Column({ type: 'timestamp', nullable: true })
  lastContactAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastResponseAt?: Date;

  @ManyToOne(() => Vacancy, (vacancy) => vacancy.candidates)
  @JoinColumn({ name: 'vacancyId' })
  vacancy: Vacancy;

  @Column()
  vacancyId: string;

  @OneToMany(() => Message, (message) => message.candidate)
  messages: Message[];

  @OneToMany(() => Resume, (resume) => resume.candidate)
  resumes: Resume[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
