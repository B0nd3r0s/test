import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CandidateStatus } from './candidate.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('candidates')
@UseGuards(JwtAuthGuard)
export class CandidatesController {
  constructor(private readonly candidatesService: CandidatesService) {}

  @Get()
  async findAll(
    @Query('vacancyId') vacancyId?: string,
    @Query('status') status?: CandidateStatus,
    @Query('minScore') minScore?: number,
  ) {
    return this.candidatesService.findAll({
      vacancyId,
      status,
      score: minScore ? parseInt(minScore.toString(), 10) : undefined,
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.candidatesService.findById(id);
  }

  @Put(':id/score')
  async updateScore(
    @Param('id') id: string,
    @Body() body: { score: number; explanation: string },
  ) {
    return this.candidatesService.updateScore(id, body.score, body.explanation);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: CandidateStatus },
  ) {
    return this.candidatesService.updateStatus(id, body.status);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: any) {
    return this.candidatesService.update(id, updateData);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.candidatesService.remove(id);
    return { success: true };
  }
}
