import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AchievementEntity } from '../achievement/achievement.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';

@Entity()
export class VisitorEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  verificationToken: string;

  @Column({ nullable: true })
  verificationExpiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  lastVisitAt: Date;

  @Column({ type: 'text', nullable: true })
  avatarSvg?: string;

  @ManyToMany(() => AchievementEntity, (achievement) => achievement.visitors, {
    cascade: true,
  })
  @JoinTable()
  achievements: AchievementEntity[];

  @OneToMany(() => AchievementUnlockLogEntity, (log) => log.visitor)
  achievementUnlockLogs: AchievementUnlockLogEntity[];
}
