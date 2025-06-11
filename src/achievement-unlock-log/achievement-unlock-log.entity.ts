import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VisitorEntity } from '../visitor/visitor.entity';
import { AchievementEntity } from '../achievement/achievement.entity';

@Entity()
export class AchievementUnlockLogEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => VisitorEntity, { eager: true })
  visitor: VisitorEntity;

  @ManyToOne(() => AchievementEntity, { eager: true })
  achievement: AchievementEntity;

  @CreateDateColumn()
  unlockedAt: Date;
}
