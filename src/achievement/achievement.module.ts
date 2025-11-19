import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { AchievementEntity } from './achievement.entity';
import { VisitorEntity } from '../visitor/visitor.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';
import { AchievementResponseInterceptor } from './interceptors/achievement-response.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AchievementEntity,
      VisitorEntity,
      AchievementUnlockLogEntity,
    ]),
  ],
  controllers: [AchievementController],
  providers: [
    AchievementService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AchievementResponseInterceptor,
    },
  ],
  exports: [AchievementService],
})
export class AchievementModule {}
