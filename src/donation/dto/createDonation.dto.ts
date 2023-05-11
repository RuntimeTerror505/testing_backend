import { SupportedCryptoEnum } from '../types/supported-crypto.enum';

export class CreateDonationDto {
  amount: number;
  nickname: string;
  campainId: string;
  cryptoCurrency?: SupportedCryptoEnum;
}
