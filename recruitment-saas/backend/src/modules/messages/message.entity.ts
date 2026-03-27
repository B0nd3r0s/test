import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Candidate } from '../candidates/candidate.entity';

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
}

export enum MessageDirection {
  INCOMING = 'incoming',
  OUTGOING = 'outgoing',
}

export enum MessageChannel {
  HH = 'hh',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: MessageType, default: MessageType.TEXT })
  type: MessageType;

  @Column({ type: 'enum', enum: MessageDirection })
  direction: MessageDirection;

  @Column({ type: 'enum', enum: MessageChannel })
  channel: MessageChannel;

  @Column({ nullable: true })
  externalMessageId?: string;

  @Column({ nullable: true })
  hhNegotiationId?: string;

  @ManyToOne(() => Candidate, (candidate) => candidate.messages)
  @JoinColumn({ name: 'candidateId' })
  candidate: Candidate;

  @Column()
  candidateId: string;

  @CreateDateColumn()
  createdAt: Date;
}
