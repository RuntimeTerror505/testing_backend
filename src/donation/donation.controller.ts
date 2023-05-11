import { DonationService } from './donation.service';
import { Body, Controller, Post } from '@nestjs/common';
import { CreateDonationDto } from './dto/createDonation.dto';

@Controller('donation')
export class DonationController {
  constructor(private readonly donationService: DonationService) {}
  @Post()
  async createDonation(@Body() createDonationDto: CreateDonationDto) {
    return await this.donationService.createDonation(createDonationDto);
  }
}
