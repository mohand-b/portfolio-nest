import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { AchievementEntity } from './achievement.entity';

@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @UseGuards(JwtAdminGuard)
  @Post()
  create(@Body() dto: CreateAchievementDto): Promise<AchievementEntity> {
    return this.achievementService.create(dto);
  }

  @UseGuards(JwtAdminGuard)
  @Get()
  findAll(): Promise<AchievementEntity[]> {
    return this.achievementService.findAll();
  }

  @UseGuards(JwtAdminGuard)
  @Delete('code/:code')
  async removeByCode(@Param('code') code: string) {
    return this.achievementService.deleteByCode(code);
  }
}
