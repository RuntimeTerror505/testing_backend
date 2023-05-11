import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CampaignEntity } from './campaign.entity';

@Entity({ name: 'owners' })
export class OwnerEntity {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  walletAddress: string;

  @Column({})
  isFraud: boolean;

  @OneToMany(() => CampaignEntity, (campaign) => campaign.owner)
  campaigns: CampaignEntity[];
}
