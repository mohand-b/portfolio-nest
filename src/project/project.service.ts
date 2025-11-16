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
import { plainToInstance } from 'class-transformer';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { ProjectLightResponseDto } from './dto/project-light-response.dto';
import { PaginatedProjectsLightResponseDto } from './dto/paginated-projects-light-response.dto';
import { ProjectMinimalResponseDto } from './dto/project-minimal-response.dto';

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
    const images = files
      .filter((f) => f.mimetype?.startsWith('image/'))
      .map((f) => f.buffer);

    const project = this.projectRepository.create({
      ...dto,
      missions: parseArrayField(dto.missions),
      projectTypes: parseArrayField(dto.projectTypes),
      images,
      type: TimelineItemTypeEnum.PROJECT,
    });

    if (dto.jobId) {
      project.job = await this.jobRepository.findOneBy({ id: dto.jobId });
    }

    const skillIds = parseArrayField(dto.skillIds);
    if (skillIds.length) {
      project.skills = await this.skillRepository.find({
        where: { id: In(skillIds) },
      });
    }

    return this.projectRepository.save(project);
  }

  async update(
    id: string,
    dto: UpdateProjectDto,
    files: Express.Multer.File[] = [],
  ): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['skills', 'job'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    const simpleFields = [
      'title',
      'description',
      'context',
      'collaboration',
      'scope',
      'market',
      'challenges',
      'impact',
      'githubLink',
    ];

    simpleFields.forEach((field) => {
      if (dto[field] !== undefined) {
        project[field] = dto[field];
      }
    });

    if (dto.missions !== undefined) {
      project.missions = parseArrayField(dto.missions);
    }
    if (dto.projectTypes !== undefined) {
      project.projectTypes = parseArrayField(dto.projectTypes);
    }

    if (dto.startDate !== undefined) {
      project.startDate = dto.startDate ? new Date(dto.startDate) : null;
    }
    if (dto.endDate !== undefined) {
      project.endDate = dto.endDate ? new Date(dto.endDate) : null;
    }

    if (dto.jobId !== undefined) {
      if (dto.jobId === null || dto.jobId === '') {
        project.job = null;
      } else {
        const job = await this.jobRepository.findOneBy({ id: dto.jobId });
        if (!job) {
          throw new NotFoundException(`Job with ID ${dto.jobId} not found`);
        }
        project.job = job;
      }
    }

    if (dto.skillIds !== undefined) {
      const skillIds = parseArrayField(dto.skillIds);
      if (skillIds.length > 0) {
        project.skills = await this.skillRepository.find({
          where: { id: In(skillIds) },
        });
      } else {
        project.skills = [];
      }
    }

    if (files?.length > 0) {
      const newImages = files
        .filter((f) => f.mimetype?.startsWith('image/'))
        .map((f) => f.buffer);
      if (newImages.length > 0) {
        project.images = newImages;
      }
    }

    await this.projectRepository.save(project);

    const updated = await this.projectRepository.findOne({
      where: { id },
      relations: ['skills', 'job'],
    });

    return {
      ...updated,
      images: buffersToBase64(updated.images),
    };
  }

  async findAll(): Promise<any[]> {
    const projects = await this.projectRepository.find({
      relations: ['skills', 'job'],
      order: { createdAt: 'DESC' },
    });

    return projects.map((project) => ({
      ...project,
      images: buffersToBase64(project.images),
    }));
  }

  async findOne(id: string): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['skills', 'job'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return {
      ...project,
      images: buffersToBase64(project.images),
    };
  }

  async findAllWithFilters(
    filters: ProjectFilterDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedProjectsLightResponseDto> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.skills', 'skill')
      .leftJoinAndSelect('project.job', 'job');

    if (filters.projectTypes && filters.projectTypes.length > 0) {
      queryBuilder.andWhere('project.projectTypes && :projectTypes', {
        projectTypes: filters.projectTypes,
      });
    }

    if (filters.title) {
      queryBuilder.andWhere('LOWER(project.title) LIKE LOWER(:title)', {
        title: `%${filters.title}%`,
      });
    }

    if (filters.skillIds && filters.skillIds.length > 0) {
      queryBuilder.andWhere('skill.id IN (:...skillIds)', {
        skillIds: filters.skillIds,
      });
    }

    if (filters.isPersonal !== undefined) {
      if (filters.isPersonal) {
        queryBuilder.andWhere('project.job IS NULL');
      } else {
        queryBuilder.andWhere('project.job IS NOT NULL');
      }
    }

    const total = await queryBuilder.getCount();

    const projects = await queryBuilder
      .orderBy('project.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const data = projects.map((project) =>
      plainToInstance(ProjectLightResponseDto, project, {
        excludeExtraneousValues: true,
      }),
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findUnlinkedProjects(): Promise<ProjectMinimalResponseDto[]> {
    const projects = await this.projectRepository.find({
      where: { job: null },
      select: ['id', 'title'],
      order: { title: 'ASC' },
    });

    return plainToInstance(ProjectMinimalResponseDto, projects, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string): Promise<void> {
    const project = await this.projectRepository.findOneBy({ id });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    await this.projectRepository.delete({ id });
  }

  async detachFromTimeline(id: string): Promise<any> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['skills', 'job'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    project.startDate = null;
    project.endDate = null;

    await this.projectRepository.save(project);

    const updated = await this.projectRepository.findOne({
      where: { id },
      relations: ['skills', 'job'],
    });

    return {
      ...updated,
      images: buffersToBase64(updated.images),
    };
  }

  async deleteAll(): Promise<void> {
    await this.projectRepository
      .createQueryBuilder()
      .delete()
      .from(ProjectEntity)
      .execute();
  }
}
