import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@Controller('vacancies')
@UseGuards(JwtAuthGuard)
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    return this.vacanciesService.findAll(user.id);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.vacanciesService.findById(id);
  }

  @Post()
  async create(@Body() vacancyData: any, @CurrentUser() user: any) {
    return this.vacanciesService.create({
      ...vacancyData,
      ownerId: user.id,
    });
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.vacanciesService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.vacanciesService.remove(id);
    return { success: true };
  }
}
