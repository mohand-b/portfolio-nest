import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { In, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { JobEntity } from '../job/job.entity';
import { SkillEntity } from '../skill/skill.entity';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  async create(dto: CreateProjectDto): Promise<ProjectEntity> {
    const project = this.projectRepository.create({
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
      project.job = await this.jobRepository.findOneBy({ id: dto.jobId });
    }

    if (dto.skillIds?.length) {
      project.skills = await this.skillRepository.find({
        where: { id: In(dto.skillIds) },
      });
    }

    return this.projectRepository.save(project);
  }

  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.find({
      order: { endDate: 'DESC' },
    });
  }
}
