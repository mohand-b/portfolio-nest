import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { Job } from '../job/job.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepo.create({
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      context: dto.context,
      collaboration: dto.collaboration,
      missions: dto.missions,
      tools: dto.tools,
      projectType: dto.projectType,
      scope: dto.scope,
      market: dto.market,
      challenges: dto.challenges,
      impact: dto.impact,
      type: TimelineItemTypeEnum.PROJECT,
    });

    if (dto.jobId) {
      project.job = await this.jobRepo.findOneBy({ id: dto.jobId });
    }

    return this.projectRepo.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepo.find({
      order: { endDate: 'DESC' },
    });
  }
}
