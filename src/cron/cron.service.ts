import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';
import { CampaignStatus } from 'src/campaign/types/campaign-status.enum';
import { Repository } from 'typeorm';

@Injectable()
export class CronService {
  constructor(
    @InjectRepository(CampaignEntity)
    private campaignService: Repository<CampaignEntity>,
  ) {}
  @Cron(CronExpression.EVERY_10_SECONDS, { name: 'checkExpiresStatuses' })
  async checkExpiresStatuses() {
    const campaigns = await this.campaignService.find();
    const mappedCampaigns = campaigns.map((campaign) => {
      if (new Date(campaign.expires_at).getTime() < new Date().getTime()) {
        campaign.status = CampaignStatus.expired;
      }
      return campaign;
    });
    await this.campaignService.save(mappedCampaigns);
  }
}
