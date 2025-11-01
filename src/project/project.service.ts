import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './project.entity';
import { In, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { JobEntity } from '../job/job.entity';
import { SkillEntity } from '../skill/skill.entity';
import { parseArrayField } from '../utils/array.utils';
import { buffersToBase64 } from '../utils/image.utils';

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

  async create(
    dto: CreateProjectDto,
    files: Express.Multer.File[] = [],
  ): Promise<ProjectEntity> {
    const images: Buffer[] = files
      .filter((f) => f.mimetype?.startsWith('image/'))
      .map((f) => f.buffer);

    const project = this.projectRepository.create({
      title: dto.title,
      context: dto.context,
      collaboration: dto.collaboration,
      missions: parseArrayField(dto.missions),
      tools: parseArrayField(dto.tools),
      projectTypes: parseArrayField(dto.projectTypes),
      scope: dto.scope,
      market: dto.market,
      challenges: dto.challenges,
      impact: dto.impact,
      images,
      githubLink: dto.githubLink,
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

  async update(id: string, dto: UpdateProjectDto): Promise<ProjectEntity> {
    const project = await this.projectRepository.findOneBy({ id });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    if (dto.startDate !== undefined) {
      project.startDate = dto.startDate ? new Date(dto.startDate) : null;
    }
    if (dto.endDate !== undefined) {
      project.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    return this.projectRepository.save(project);
  }

  async findAll(): Promise<any[]> {
    const projects = await this.projectRepository.find({
      relations: ['skills', 'job'],
      order: { endDate: 'DESC' },
    });

    return projects.map((project) => ({
      ...project,
      images: buffersToBase64(project.images),
    }));
  }
}
