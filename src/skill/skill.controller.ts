import { Body, Controller, Get, Post } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillEntity } from './skill.entity';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  async create(@Body() dto: CreateSkillDto): Promise<SkillEntity> {
    return this.skillService.create(dto);
  }

  @Get()
  async findAll(): Promise<SkillEntity[]> {
    return this.skillService.findAll();
  }
}
