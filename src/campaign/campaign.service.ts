import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CronService } from '../cron/cron.service';
import { DonationEntity } from 'src/donation/entities/donation.entity';
import { DonationState } from 'src/donation/types/donation-state.enum';
import { Repository } from 'typeorm';
import { CampaignEntity } from './entities/campaign.entity';
import { OwnerEntity } from './entities/owner.entity';
import { CampaignStatus } from './types/campaign-status.enum';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(CampaignEntity)
    private campaignRepository: Repository<CampaignEntity>,
    @InjectRepository(OwnerEntity)
    private ownerRepository: Repository<OwnerEntity>,
    @InjectRepository(DonationEntity)
    private donationRepository: Repository<DonationEntity>,
    private cronService: CronService,
  ) {}
  async getCampaigns() {
    this.cronService.checkExpiresStatuses();
    return this.campaignRepository.find({
      where: { status: CampaignStatus.active },
    });
  }

  async markCampaignAsFraud(campaignId: string) {
    const fraudCampaign = await this.campaignRepository.findOne({
      where: { id: campaignId },
      relations: { donations: true, owner: { campaigns: { donations: true } } },
    });

    const campaignOwner = fraudCampaign.owner;
    campaignOwner.isFraud = true;
    for await (const campaign of campaignOwner.campaigns) {
      campaign.status = CampaignStatus.fraud;
      for await (const donation of campaign.donations) {
        donation.state = DonationState.invalid;
        await this.donationRepository.save(donation);
      }
      await this.campaignRepository.save(campaign);
    }
    console.log(campaignOwner);

    return await this.ownerRepository.save(campaignOwner);
  }
}
