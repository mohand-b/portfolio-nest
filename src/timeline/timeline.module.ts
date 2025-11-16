import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimelineItem } from './timeline-item.entity';
import { TimelineService } from './timeline.service';
import { TimelineController } from './timeline.controller';
import { JobEntity } from '../job/job.entity';
import { ProjectEntity } from '../project/project.entity';
import { EducationEntity } from '../education/education.entity';
import { MilestoneEntity } from '../milestone/milestone.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TimelineItem,
      JobEntity,
      ProjectEntity,
      EducationEntity,
      MilestoneEntity,
    ]),
  ],
  controllers: [TimelineController],
  providers: [TimelineService],
  exports: [TimelineService],
})
export class TimelineModule {}
