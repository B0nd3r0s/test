import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommunicationLog } from './communication-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommunicationLog])],
  exports: [TypeOrmModule],
})
export class CommunicationsModule {}
