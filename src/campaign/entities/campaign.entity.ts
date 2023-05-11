import { DonationEntity } from 'src/donation/entities/donation.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CampaignStatus } from '../types/campaign-status.enum';
import { OwnerEntity } from './owner.entity';

@Entity({ name: 'campaigns' })
export class CampaignEntity {
  @PrimaryColumn({ type: 'uuid' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'float' })
  goal: number;

  @Column({ type: 'date' })
  expires_at: Date;

  @Column({ type: 'enum', enum: CampaignStatus })
  status: CampaignStatus;

  @Column({})
  currency: string;

  @ManyToOne(() => OwnerEntity, (owner) => owner.campaigns)
  @JoinColumn({ name: 'ownerId' })
  owner: OwnerEntity;

  @OneToMany(() => DonationEntity, (donation) => donation.campaignId)
  donations: DonationEntity[];
}
