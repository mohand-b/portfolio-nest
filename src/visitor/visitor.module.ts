import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { VisitorEntity } from './visitor.entity';
import { CoreModule } from '../core/core.module';
import { AchievementModule } from '../achievement/achievement.module';
import { AchievementEntity } from '../achievement/achievement.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';
import { AvatarService } from './avatar.service';
import { VisitorActivityInterceptor } from './interceptors/visitor-activity.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VisitorEntity,
      AchievementEntity,
      AchievementUnlockLogEntity,
    ]),
    CoreModule,
    AchievementModule,
  ],
  controllers: [VisitorController],
  providers: [
    VisitorService,
    AvatarService,
    VisitorActivityInterceptor,
    {
      provide: APP_INTERCEPTOR,
      useExisting: VisitorActivityInterceptor,
    },
  ],
  exports: [VisitorService],
})
export class VisitorModule {}
