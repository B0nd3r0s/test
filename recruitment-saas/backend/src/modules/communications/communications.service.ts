import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommunicationLog, CommunicationType, CommunicationChannel } from './communication-log.entity';

@Injectable()
export class CommunicationsService {
  constructor(
    @InjectRepository(CommunicationLog)
    private logsRepository: Repository<CommunicationLog>,
  ) {}

  async log(data: {
    candidateId: string;
    vacancyId?: string;
    type: CommunicationType;
    channel: CommunicationChannel;
    content?: string;
    metadata?: Record<string, any>;
    userId?: string;
  }): Promise<CommunicationLog> {
    const log = this.logsRepository.create(data);
    return this.logsRepository.save(log);
  }

  async findByCandidate(candidateId: string): Promise<CommunicationLog[]> {
    return this.logsRepository.find({
      where: { candidateId },
      order: { createdAt: 'DESC' },
    });
  }
}
