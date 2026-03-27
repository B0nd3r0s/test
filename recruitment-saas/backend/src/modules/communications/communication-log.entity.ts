import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum CommunicationType {
  MESSAGE_SENT = 'message_sent',
  MESSAGE_RECEIVED = 'message_received',
  SCORE_CALCULATED = 'score_calculated',
  STATUS_CHANGED = 'status_changed',
  CASCADE_TRIGGERED = 'cascade_triggered',
}

export enum CommunicationChannel {
  HH = 'hh',
  TELEGRAM = 'telegram',
  WHATSAPP = 'whatsapp',
  SYSTEM = 'system',
}

@Entity('communication_logs')
export class CommunicationLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  candidateId: string;

  @Column({ nullable: true })
  vacancyId?: string;

  @Column({ type: 'enum', enum: CommunicationType })
  type: CommunicationType;

  @Column({ type: 'enum', enum: CommunicationChannel })
  channel: CommunicationChannel;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata?: Record<string, any>;

  @Column({ nullable: true })
  userId?: string;

  @CreateDateColumn()
  createdAt: Date;
}
