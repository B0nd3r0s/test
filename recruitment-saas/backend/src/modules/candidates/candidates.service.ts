import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Candidate, CandidateStatus, ContactChannel } from './candidate.entity';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectRepository(Candidate)
    private candidatesRepository: Repository<Candidate>,
  ) {}

  async create(candidateData: Partial<Candidate>): Promise<Candidate> {
    const candidate = this.candidatesRepository.create(candidateData);
    return this.candidatesRepository.save(candidate);
  }

  async findAll(filters?: {
    vacancyId?: string;
    status?: CandidateStatus;
    score?: number;
  }): Promise<Candidate[]> {
    const query = this.candidatesRepository.createQueryBuilder('candidate');
    
    if (filters?.vacancyId) {
      query.where('candidate.vacancyId = :vacancyId', { vacancyId: filters.vacancyId });
    }
    if (filters?.status) {
      query.andWhere('candidate.status = :status', { status: filters.status });
    }
    if (filters?.score !== undefined) {
      query.andWhere('candidate.score >= :score', { score: filters.score });
    }
    
    query.orderBy('candidate.score', 'DESC').addOrderBy('candidate.createdAt', 'DESC');
    return query.getMany();
  }

  async findById(id: string): Promise<Candidate> {
    const candidate = await this.candidatesRepository.findOne({
      where: { id },
      relations: ['vacancy', 'resumes', 'messages'],
    });
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }
    return candidate;
  }

  async update(id: string, updateData: Partial<Candidate>): Promise<Candidate> {
    const candidate = await this.findById(id);
    Object.assign(candidate, updateData);
    return this.candidatesRepository.save(candidate);
  }

  async updateScore(
    id: string,
    score: number,
    explanation: string,
  ): Promise<Candidate> {
    return this.update(id, { score, scoreExplanation: explanation });
  }

  async updateStatus(id: string, status: CandidateStatus): Promise<Candidate> {
    return this.update(id, { status });
  }

  async markContacted(id: string, channel: ContactChannel): Promise<void> {
    await this.candidatesRepository.update(id, {
      lastContactAt: new Date(),
      preferredChannel: channel,
    });
  }

  async markResponse(id: string): Promise<void> {
    await this.candidatesRepository.update(id, {
      lastResponseAt: new Date(),
    });
  }

  async remove(id: string): Promise<void> {
    const candidate = await this.findById(id);
    await this.candidatesRepository.remove(candidate);
  }
}
