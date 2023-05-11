import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { DonationEntity } from './entities/donation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DonationEntity, CampaignEntity]),
    HttpModule,
  ],
  controllers: [DonationController],
  providers: [DonationService],
})
export class DonationModule {}
