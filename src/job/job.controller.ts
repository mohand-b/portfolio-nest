import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { JobEntity } from './job.entity';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('create')
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateJobDto,
  ): Promise<JobEntity> {
    if (file && file.buffer) {
      dto.image = file.buffer;
    }
    return this.jobService.create(dto);
  }

  @Get()
  async findAll(): Promise<JobEntity[]> {
    return this.jobService.findAll();
  }
}
