import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillEntity } from './skill.entity';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @UseGuards(JwtAdminGuard)
  @Post()
  async create(@Body() dto: CreateSkillDto): Promise<SkillEntity> {
    return this.skillService.create(dto);
  }

  @Get()
  async findAll(): Promise<SkillEntity[]> {
    return this.skillService.findAll();
  }
}
