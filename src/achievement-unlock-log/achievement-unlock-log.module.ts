import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementUnlockLogService } from './achievement-unlock-log.service';
import { AchievementUnlockLogController } from './achievement-unlock-log.controller';
import { VisitorEntity } from '../visitor/visitor.entity';
import { AchievementEntity } from '../achievement/achievement.entity';
import { AchievementUnlockLogEntity } from './achievement-unlock-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchievementUnlockLogEntity,
      VisitorEntity,
      AchievementEntity,
    ]),
  ],
  providers: [AchievementUnlockLogService],
  controllers: [AchievementUnlockLogController],
  exports: [AchievementUnlockLogService],
})
export class AchievementUnlockLogModule {}
