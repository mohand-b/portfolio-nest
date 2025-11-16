import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JobService } from './job.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { JobMinimalResponseDto } from './dto/job-minimal-response.dto';
import { JobResponseDto } from './dto/job-response.dto';
import { memoryStorage } from 'multer';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('create')
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateJobDto,
  ): Promise<JobResponseDto> {
    if (file?.buffer) {
      dto.image = file.buffer;
    }
    return this.jobService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(FileInterceptor('image', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<JobResponseDto> {
    if (file?.buffer) {
      dto.image = file.buffer;
    }
    return this.jobService.update(id, dto);
  }

  @Get()
  async findAll(): Promise<JobResponseDto[]> {
    return this.jobService.findAll();
  }

  @Get('minimal')
  async findAllMinimal(): Promise<JobMinimalResponseDto[]> {
    return this.jobService.findAllMinimal();
  }

  @UseGuards(JwtAdminGuard)
  @Delete('all')
  async deleteAll(): Promise<{ message: string }> {
    await this.jobService.deleteAll();
    return { message: 'All jobs deleted successfully' };
  }

  @UseGuards(JwtAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.jobService.delete(id);
    return { message: 'Job deleted successfully' };
  }
}
