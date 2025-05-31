import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { CreateJobDto } from './dto/create-job.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';

@Injectable()
export class JobService {
  constructor(
    @InjectRepository(Job)
    private readonly jobRepo: Repository<Job>,
  ) {}

  async create(dto: CreateJobDto): Promise<Job> {
    const job = this.jobRepo.create({
      title: dto.title,
      startDate: dto.startDate,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      company: dto.company,
      location: dto.location,
      missions: dto.missions,
      type: TimelineItemTypeEnum.JOB,
    });

    return this.jobRepo.save(job);
  }

  async findAll(): Promise<Job[]> {
    return this.jobRepo.find({
      order: { endDate: 'DESC' },
    });
  }
}
