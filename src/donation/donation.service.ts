import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { CampaignEntity } from 'src/campaign/entities/campaign.entity';
import { CampaignStatus } from 'src/campaign/types/campaign-status.enum';
import { DataSource, Repository } from 'typeorm';
import { CreateDonationDto } from './dto/createDonation.dto';
import { DonationEntity } from './entities/donation.entity';
import { DonationState } from './types/donation-state.enum';

@Injectable()
export class DonationService {
  constructor(
    @InjectRepository(DonationEntity)
    private donationRepository: Repository<DonationEntity>,
    @InjectRepository(CampaignEntity)
    private campaignRepository: Repository<CampaignEntity>,
    private dataScource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  async createDonation({
    amount,
    campainId,
    nickname,
    cryptoCurrency,
  }: CreateDonationDto) {
    const campaign = await this.campaignRepository.findOne({
      where: { id: campainId },
    });
    if (!campaign) {
      throw new HttpException(
        'no campaign with such id',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (!campaign.donations) {
      campaign.donations = [];
    }
    let cryptoAmount: number;
    if (cryptoCurrency) {
      cryptoAmount = await this.calcCryptoAmount(cryptoCurrency, amount);
    }

    let queryRunner = this.dataScource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    let donation: DonationEntity;
    try {
      donation = new DonationEntity();
      const id = randomUUID({});
      donation.id = id;
      if (cryptoAmount) {
        donation.cryptoAmount = cryptoAmount;
        donation.selectedCrypto = cryptoCurrency;
      }
      donation.amount = amount;

      donation.campaignId = campaign;
      donation.donatorNickname = nickname;
      campaign.status == CampaignStatus.fraud
        ? (donation.state = DonationState.invalid)
        : (donation.state = DonationState.valid);
      campaign.donations.push(donation);
      this.checkIfSuccessCampaign(campaign);

      await queryRunner.manager.getRepository(CampaignEntity).save(campaign);
      await queryRunner.manager.getRepository(DonationEntity).save(donation);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new HttpException(
        'Could not perform a donation',
        HttpStatus.BAD_REQUEST,
      );
    }
    return { ...donation, campaignId: campaign.id };
  }

  async checkIfSuccessCampaign(campaign: CampaignEntity) {
    let donationsSum = 0;
    campaign.donations.forEach((donation) => {
      donationsSum += donation.amount;
    });
    if (donationsSum >= campaign.goal) {
      campaign.status = CampaignStatus.successful;
      return true;
    }
    return false;
  }

  async calcCryptoAmount(cryptoCurrency: string, amount: number) {
    const exchangeValues = await firstValueFrom(
      this.httpService.get(
        `https://api.coinbase.com/v2/exchange-rates?currency=${cryptoCurrency}`,
      ),
    );

    return amount / exchangeValues.data.data.rates.USDT;
  }
}
