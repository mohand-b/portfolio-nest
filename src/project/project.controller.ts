import { Body, Controller, Get, Param, Patch, Post, Query, UploadedFiles, UseInterceptors, } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectEntity } from './project.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProjectService } from './project.service';
import { ProjectFilterDto } from './dto/project-filter.dto';
import { PaginatedProjectsResponseDto } from './dto/pagined-projects-response.dto';

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

  @Get('list')
  async findAllWithFilters(
    @Query() filters: ProjectFilterDto,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<PaginatedProjectsResponseDto> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.projectService.findAllWithFilters(filters, pageNum, limitNum);
  }
}
