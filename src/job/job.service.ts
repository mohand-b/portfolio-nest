import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { toValidDate } from '../utils/date.utils';
import { parseArrayField } from '../utils/array.utils';
import { bufferToBase64 } from '../utils/image.utils';
import { JobMinimalResponseDto } from './dto/job-minimal-response.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}

  async create(dto: CreateJobDto): Promise<JobResponseDto> {
    const job = this.jobRepository.create({
      ...dto,
      startDate: toValidDate(dto.startDate),
      endDate: toValidDate(dto.endDate),
      missions: parseArrayField(dto.missions),
      type: TimelineItemTypeEnum.JOB,
    });

    const saved = await this.jobRepository.save(job);

    return plainToInstance(JobResponseDto, {
      ...saved,
      image: bufferToBase64(saved.image),
    });
  }

  async findAll(): Promise<JobResponseDto[]> {
    const jobs = await this.jobRepository.find({
      relations: ['projects'],
      order: { endDate: 'DESC' },
    });

    return jobs.map((job) =>
      plainToInstance(JobResponseDto, {
        ...job,
        image: bufferToBase64(job.image),
      }),
    );
  }

  async findAllMinimal(): Promise<JobMinimalResponseDto[]> {
    const jobs = await this.jobRepository.find({
      select: ['id', 'company', 'image'],
      order: { company: 'ASC' },
    });

    return jobs.map((job) => ({
      id: job.id,
      company: job.company,
      logo: bufferToBase64(job.image),
    }));
  }

  async update(id: string, dto: UpdateJobDto): Promise<JobResponseDto> {
    const job = await this.jobRepository.findOne({ where: { id } });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    if (dto.title !== undefined) job.title = dto.title;
    if (dto.company !== undefined) job.company = dto.company;
    if (dto.location !== undefined) job.location = dto.location;
    if (dto.image !== undefined) job.image = dto.image;
    if (dto.startDate !== undefined) job.startDate = toValidDate(dto.startDate);
    if (dto.endDate !== undefined) job.endDate = toValidDate(dto.endDate);
    if (dto.missions !== undefined) job.missions = parseArrayField(dto.missions);

    const saved = await this.jobRepository.save(job);

    return plainToInstance(JobResponseDto, {
      ...saved,
      image: bufferToBase64(saved.image),
    });
  }

  async delete(id: string): Promise<void> {
    const result = await this.jobRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }
  }

  async deleteAll(): Promise<void> {
    await this.jobRepository
      .createQueryBuilder()
      .delete()
      .from(JobEntity)
      .execute();
  }
}
