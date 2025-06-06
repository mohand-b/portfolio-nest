import { Body, Controller, Get, Post } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobEntity } from './job.entity';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(@Body() dto: CreateJobDto): Promise<JobEntity> {
    return this.jobService.create(dto);
  }

  @Get()
  async findAll(): Promise<JobEntity[]> {
    return this.jobService.findAll();
  }
}
