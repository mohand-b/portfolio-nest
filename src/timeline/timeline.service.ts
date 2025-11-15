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
        .map((job) =>
          plainToInstance(JobTimelineItemDto, job, {
            excludeExtraneousValues: true,
          }),
        );
      items.push(...jobDtos);
    }

    // Fetch projects if requested (only those with startDate)
    if (requestedTypes.includes(TimelineItemTypeEnum.PROJECT)) {
      const projects = await this.projectRepository.find();
      const projectDtos = projects
        .filter((project) => project.startDate) // Only include projects with startDate
        .map((project) =>
          plainToInstance(ProjectTimelineItemDto, project, {
            excludeExtraneousValues: true,
          }),
        );
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
