import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobEntity } from './job.entity';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  @UseGuards(JwtAdminGuard)
  async create(@Body() dto: CreateJobDto): Promise<JobEntity> {
    return this.jobService.create(dto);
  }

  @Get()
  async findAll(): Promise<JobEntity[]> {
    return this.jobService.findAll();
  }
}
