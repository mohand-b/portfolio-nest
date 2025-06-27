import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillEntity } from './skill.entity';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';

@Controller('skills')
export class SkillController {
  constructor(private readonly skillService: SkillService) {}

  @UseGuards(JwtAdminGuard)
  @Post('create')
  async create(@Body() dto: CreateSkillDto): Promise<SkillEntity> {
    return this.skillService.create(dto);
  }

  @Get()
  async findAll(): Promise<SkillEntity[]> {
    return this.skillService.findAll();
  }

  @UseGuards(JwtAdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.skillService.delete(id);
    return { message: 'Compétence supprimée avec succès.' };
  }

  @UseGuards(JwtAdminGuard)
  @Patch(':id/category')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: { category: string },
  ) {
    return this.skillService.updateCategory(id, dto.category);
  }

  @UseGuards(JwtAdminGuard)
  @Patch(':id/level')
  async updateLevel(@Param('id') id: string, @Body() dto: { level: number }) {
    return this.skillService.updateLevel(id, dto.level);
  }
}
