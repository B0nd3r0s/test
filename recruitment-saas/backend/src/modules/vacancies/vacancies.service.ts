import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancy, VacancyStatus } from './vacancy.entity';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private vacanciesRepository: Repository<Vacancy>,
  ) {}

  async create(vacancyData: Partial<Vacancy>): Promise<Vacancy> {
    const vacancy = this.vacanciesRepository.create(vacancyData);
    return this.vacanciesRepository.save(vacancy);
  }

  async findAll(ownerId?: string): Promise<Vacancy[]> {
    const query = this.vacanciesRepository.createQueryBuilder('vacancy');
    if (ownerId) {
      query.where('vacancy.ownerId = :ownerId', { ownerId });
    }
    return query.getMany();
  }

  async findById(id: string): Promise<Vacancy> {
    const vacancy = await this.vacanciesRepository.findOne({ where: { id } });
    if (!vacancy) {
      throw new NotFoundException('Vacancy not found');
    }
    return vacancy;
  }

  async findByHhId(hhVacancyId: string): Promise<Vacancy | null> {
    return this.vacanciesRepository.findOne({ where: { hhVacancyId } });
  }

  async update(id: string, updateData: Partial<Vacancy>): Promise<Vacancy> {
    const vacancy = await this.findById(id);
    Object.assign(vacancy, updateData);
    return this.vacanciesRepository.save(vacancy);
  }

  async updateStatus(id: string, status: VacancyStatus): Promise<Vacancy> {
    return this.update(id, { status });
  }

  async remove(id: string): Promise<void> {
    const vacancy = await this.findById(id);
    await this.vacanciesRepository.remove(vacancy);
  }
}
