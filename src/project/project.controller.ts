import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectEntity } from './project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async create(@Body() dto: CreateProjectDto): Promise<ProjectEntity> {
    return this.projectService.create(dto);
  }

  @Get()
  async findAll(): Promise<ProjectEntity[]> {
    return this.projectService.findAll();
  }
}
