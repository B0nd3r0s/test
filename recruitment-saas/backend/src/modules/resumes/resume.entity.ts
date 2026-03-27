import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Candidate } from '../candidates/candidate.entity';

@Entity('resumes')
export class Resume {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  hhResumeId?: string;

  @Column({ type: 'text', nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  fullName?: string;

  @Column({ type: 'text', nullable: true })
  position?: string;

  @Column({ type: 'text', nullable: true })
  experience?: string;

  @Column({ type: 'jsonb', nullable: true })
  skills?: string[];

  @Column({ type: 'text', nullable: true })
  about?: string;

  @Column({ type: 'text', nullable: true })
  rawText?: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.resumes)
  @JoinColumn({ name: 'candidateId' })
  candidate: Candidate;

  @Column()
  candidateId: string;

  @CreateDateColumn()
  createdAt: Date;
}
