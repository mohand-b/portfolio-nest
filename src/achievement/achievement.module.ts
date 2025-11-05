import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { AchievementEntity } from './achievement.entity';
import { VisitorEntity } from '../visitor/visitor.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchievementEntity,
      VisitorEntity,
      AchievementUnlockLogEntity,
    ]),
  ],
  controllers: [AchievementController],
  providers: [AchievementService],
  exports: [AchievementService],
})
export class AchievementModule {}
