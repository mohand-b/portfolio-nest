import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { toValidDate } from '../utils/date.utils';
import { parseArrayField } from '../utils/array.utils';
import { bufferToBase64 } from '../utils/image.utils';
import { JobMinimalResponseDto } from './dto/job-minimal-response.dto';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}

  async create(dto: CreateJobDto): Promise<JobEntity> {
    const job = this.jobRepository.create({
      ...dto,
      startDate: toValidDate(dto.startDate),
      endDate: toValidDate(dto.endDate),
      missions: parseArrayField(dto.missions),
      type: TimelineItemTypeEnum.JOB,
    });

    return this.jobRepository.save(job);
  }

  async findAll(): Promise<any[]> {
    const jobs = await this.jobRepository.find({
      relations: ['projects'],
      order: { endDate: 'DESC' },
    });

    return jobs.map((job) => ({
      ...job,
      image: bufferToBase64(job.image),
    }));
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

  async deleteAll(): Promise<void> {
    await this.jobRepository
      .createQueryBuilder()
      .delete()
      .from(JobEntity)
      .execute();
  }
}
