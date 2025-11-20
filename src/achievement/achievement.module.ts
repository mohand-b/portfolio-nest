import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { AchievementEntity } from './achievement.entity';
import { VisitorEntity } from '../visitor/visitor.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';
import { AchievementResponseInterceptor } from './interceptors/achievement-response.interceptor';
import { AchievementAutoUnlockService } from './services/achievement-auto-unlock.service';

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
    AchievementAutoUnlockService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AchievementResponseInterceptor,
    },
  ],
  exports: [AchievementService, AchievementAutoUnlockService],
})
export class AchievementModule {}
