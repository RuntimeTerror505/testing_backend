import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';
import { CronService } from './cron.service';

@Module({
  imports: [TypeOrmModule.forFeature([CampaignEntity])],
  providers: [CronService],
  exports: [CronService],
})
export class CronModule {}
