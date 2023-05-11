import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronModule } from 'src/cron/cron.module';
import { DonationEntity } from 'src/donation/entities/donation.entity';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { CampaignEntity } from './entities/campaign.entity';
import { OwnerEntity } from './entities/owner.entity';

@Module({
  imports: [
    CronModule,
    TypeOrmModule.forFeature([CampaignEntity, OwnerEntity, DonationEntity]),
  ],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
