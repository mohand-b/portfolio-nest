import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitorController } from './visitor.controller';
import { VisitorService } from './visitor.service';
import { VisitorEntity } from './visitor.entity';
import { CoreModule } from '../core/core.module';
import { AchievementEntity } from '../achievement/achievement.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([VisitorEntity, AchievementEntity]),
    CoreModule,
  ],
  controllers: [VisitorController],
  providers: [VisitorService],
  exports: [VisitorService],
})
export class VisitorModule {}
