import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobEntity } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { toValidDate } from '../utils/date.utils';
import { parseArrayField } from '../utils/array.utils';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(JobEntity)
    private readonly jobRepository: Repository<JobEntity>,
  ) {}

  async create(dto: CreateJobDto): Promise<JobEntity> {
    const job = this.jobRepository.create({
      title: dto.title,
      startDate: toValidDate(dto.startDate),
      endDate: toValidDate(dto.endDate),
      company: dto.company,
      location: dto.location,
      missions: parseArrayField(dto.missions),
      type: TimelineItemTypeEnum.JOB,
      image: dto.image,
    });

    return this.jobRepository.save(job);
  }

  async findAll(): Promise<JobEntity[]> {
    return this.jobRepository.find({
      order: { endDate: 'DESC' },
    });
  }
}
