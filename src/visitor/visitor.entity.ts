import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AchievementEntity } from '../achievement/achievement.entity';

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

  @ManyToMany(() => AchievementEntity, (achievement) => achievement.visitors, {
    cascade: true,
  })
  @JoinTable()
  achievements: AchievementEntity[];
}
