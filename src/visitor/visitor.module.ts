import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { VisitorEntity } from './visitor.entity';
import { CoreModule } from '../core/core.module';
import { AchievementEntity } from '../achievement/achievement.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';

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
  providers: [VisitorService],
  exports: [VisitorService],
})
export class VisitorModule {}
