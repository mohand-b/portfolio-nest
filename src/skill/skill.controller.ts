import { Body, Controller, Get, Post } from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './skill.entity';

@Controller('skill')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @Post()
  async create(@Body() dto: CreateSkillDto): Promise<Skill> {
    return this.skillService.create(dto);
  }

  @Get()
  async findAll(): Promise<Skill[]> {
    return this.skillService.findAll();
  }
}
