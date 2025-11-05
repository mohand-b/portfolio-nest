import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './project.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post('create')
  @UseInterceptors(FilesInterceptor('images', 4, { storage: memoryStorage() }))
  async create(
    @Body() dto: CreateProjectDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    return this.projectService.create(dto, files);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectEntity> {
    return this.projectService.update(id, dto);
  }

  @Get()
  async findAll(): Promise<ProjectEntity[]> {
    return this.projectService.findAll();
  }
}
