import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { JobEntity } from '../job/job.entity';
import { SkillEntity } from '../skill/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, JobEntity, SkillEntity])],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
