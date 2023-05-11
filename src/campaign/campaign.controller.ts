import { Controller, Get, Post, Query } from '@nestjs/common';
import { CampaignService } from './campaign.service';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}
  @Get()
  async getCampaigns() {
    return await this.campaignService.getCampaigns();
  }

  @Post()
  async markCampaignAsFraud(@Query('campaignId') campaignId: string) {
    return await this.campaignService.markCampaignAsFraud(campaignId);
  }
}
