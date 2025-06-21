import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VisitorEntity } from '../visitor/visitor.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';

@Entity()
export class AchievementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => VisitorEntity, (visitor) => visitor.achievements, {
    onDelete: 'CASCADE',
  })
  visitors: VisitorEntity[];

  @OneToMany(() => AchievementUnlockLogEntity, (log) => log.achievement)
  achievementUnlockLogs: AchievementUnlockLogEntity[];
}
