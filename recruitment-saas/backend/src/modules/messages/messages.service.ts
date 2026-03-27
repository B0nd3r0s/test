import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageDirection, MessageChannel } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async create(messageData: Partial<Message>): Promise<Message> {
    const message = this.messagesRepository.create(messageData);
    return this.messagesRepository.save(message);
  }

  async findByCandidateId(candidateId: string): Promise<Message[]> {
    return this.messagesRepository.find({
      where: { candidateId },
      order: { createdAt: 'ASC' },
    });
  }

  async logOutgoing(
    candidateId: string,
    content: string,
    channel: MessageChannel,
    externalId?: string,
    hhNegotiationId?: string,
  ): Promise<Message> {
    return this.create({
      candidateId,
      content,
      direction: MessageDirection.OUTGOING,
      channel,
      externalMessageId: externalId,
      hhNegotiationId,
    });
  }

  async logIncoming(
    candidateId: string,
    content: string,
    channel: MessageChannel,
    externalId?: string,
  ): Promise<Message> {
    return this.create({
      candidateId,
      content,
      direction: MessageDirection.INCOMING,
      channel,
      externalMessageId: externalId,
    });
  }
}
