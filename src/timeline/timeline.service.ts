import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { JobEntity } from '../job/job.entity';
import { ProjectEntity } from '../project/project.entity';
import { EducationEntity } from '../education/education.entity';
import { TimelineFilterDto } from './dto/timeline-filter.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { plainToInstance } from 'class-transformer';
import { JobTimelineItemDto } from './dto/job-timeline-item.dto';
import { ProjectTimelineItemDto } from './dto/project-timeline-item.dto';
import { EducationTimelineItemDto } from './dto/education-timeline-item.dto';
import { BaseTimelineItemDto } from './dto/base-timeline-item.dto';
import { CertificationLightDto } from './dto/certification-light.dto';
import { SkillLightDto } from './dto/skill-light.dto';
import { bufferToBase64 } from '../utils/image.utils';

type TimelineItemDto =
  | JobTimelineItemDto
  | ProjectTimelineItemDto
  | EducationTimelineItemDto
  | BaseTimelineItemDto;

@Injectable()
export class TimelineService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(EducationEntity)
    private readonly educationRepository: Repository<EducationEntity>,
  ) {}

  async findAllTimeline(
    filters: TimelineFilterDto,
  ): Promise<TimelineItemDto[]> {
    const requestedTypes = filters.types || [
      TimelineItemTypeEnum.JOB,
      TimelineItemTypeEnum.PROJECT,
      TimelineItemTypeEnum.EDUCATION,
      TimelineItemTypeEnum.OTHER,
    ];

    const items: TimelineItemDto[] = [];

    // Fetch jobs if requested (only those with startDate)
    if (requestedTypes.includes(TimelineItemTypeEnum.JOB)) {
      const jobs = await this.jobRepository.find();
      const jobDtos = jobs
        .filter((job) => job.startDate) // Only include jobs with startDate
        .map((job) => {
          const dto = plainToInstance(JobTimelineItemDto, job, {
            excludeExtraneousValues: true,
          });
          dto.image = bufferToBase64(job.image);
          return dto;
        });
      items.push(...jobDtos);
    }

    // Fetch projects if requested (only those with startDate)
    if (requestedTypes.includes(TimelineItemTypeEnum.PROJECT)) {
      const projects = await this.projectRepository.find({
        relations: ['skills'],
      });
      const projectDtos = projects
        .filter((project) => project.startDate) // Only include projects with startDate
        .map((project) => {
          const dto = plainToInstance(ProjectTimelineItemDto, project, {
            excludeExtraneousValues: true,
          });
          // Map skills manually to ensure proper transformation
          dto.skills = (project.skills || []).map((skill) =>
            plainToInstance(SkillLightDto, skill, {
              excludeExtraneousValues: true,
            }),
          );
          return dto;
        });
      items.push(...projectDtos);
    }

    // Fetch education if requested (only those with startDate)
    if (requestedTypes.includes(TimelineItemTypeEnum.EDUCATION)) {
      const educations = await this.educationRepository.find({
        relations: ['certifications'],
      });
      const educationDtos = educations
        .filter((education) => education.startDate) // Only include education with startDate
        .map((education) => {
          const dto = plainToInstance(EducationTimelineItemDto, education, {
            excludeExtraneousValues: true,
          });
          // Map certifications manually to ensure proper transformation
          dto.certifications = (education.certifications || []).map((cert) =>
            plainToInstance(CertificationLightDto, cert, {
              excludeExtraneousValues: true,
            }),
          );
          dto.image = bufferToBase64(education.image);
          return dto;
        });
      items.push(...educationDtos);
    }

    // Sort by endDate descending (most recent first)
    items.sort((a, b) => {
      if (!a.endDate && !b.endDate) return 0;
      if (!a.endDate) return 1;
      if (!b.endDate) return -1;
      return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
    });

    return items;
  }
}
