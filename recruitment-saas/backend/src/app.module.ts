import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';

// Database
import { databaseConfig } from './database/database.config';
import { User } from './modules/users/user.entity';
import { Vacancy } from './modules/vacancies/vacancy.entity';
import { Candidate } from './modules/candidates/candidate.entity';
import { Resume } from './modules/resumes/resume.entity';
import { Message } from './modules/messages/message.entity';
import { Integration } from './modules/integrations/integration.entity';
import { CommunicationLog } from './modules/communications/communication-log.entity';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { VacanciesModule } from './modules/vacancies/vacancies.module';
import { CandidatesModule } from './modules/candidates/candidates.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { MessagesModule } from './modules/messages/messages.module';
import { IntegrationsModule } from './modules/integrations/integrations.module';
import { CommunicationsModule } from './modules/communications/communications.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...databaseConfig,
        entities: [
          User,
          Vacancy,
          Candidate,
          Resume,
          Message,
          Integration,
          CommunicationLog,
        ],
        synchronize: false, // Use migrations in production
      }),
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UsersModule,
    VacanciesModule,
    CandidatesModule,
    ResumesModule,
    MessagesModule,
    IntegrationsModule,
    CommunicationsModule,
    AnalyticsModule,
    AiModule,
  ],
})
export class AppModule {}
