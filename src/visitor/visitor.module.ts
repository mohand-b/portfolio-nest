import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { VisitorEntity } from './visitor.entity';
import { CoreModule } from '../core/core.module';
import { AchievementEntity } from '../achievement/achievement.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';
import { AvatarService } from './avatar.service';
import { VisitorActivityInterceptor } from './visitor-activity.interceptor';
import { AchievementSyncService } from './achievement-sync.service';
import { AchievementSyncInterceptor } from '../common/interceptors/achievement-sync.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisitorEntity,
      AchievementEntity,
      AchievementUnlockLogEntity,
    ]),
    CoreModule,
  ],
  controllers: [VisitorController],
  providers: [
    VisitorService,
    AvatarService,
    AchievementSyncService,
    {
      provide: APP_INTERCEPTOR,
      useClass: VisitorActivityInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AchievementSyncInterceptor,
    },
  ],
  exports: [VisitorService],
})
export class VisitorModule {}
