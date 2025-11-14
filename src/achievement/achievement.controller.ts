import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementEntity } from './achievement.entity';
import { AchievementResponseDto } from './dto/achievement-response.dto';
import { AchievementStatsDto } from './dto/achievement-stats.dto';
import { AchievementFilterDto } from './dto/achievement-filter.dto';
import { PaginatedAchievementsResponseDto } from './dto/paginated-achievements-response.dto';

@Controller('achievements')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @UseGuards(JwtAdminGuard)
  @Post()
  create(@Body() dto: CreateAchievementDto): Promise<AchievementEntity> {
    return this.achievementService.create(dto);
  }

  @UseGuards(JwtAdminGuard)
  @Patch('code/:code')
  update(
    @Param('code') code: string,
    @Body() dto: UpdateAchievementDto,
  ): Promise<AchievementResponseDto> {
    return this.achievementService.update(code, dto);
  }

  @UseGuards(JwtAdminGuard)
  @Get('stats')
  getStats(): Promise<AchievementStatsDto> {
    return this.achievementService.getStats();
  }

  @UseGuards(JwtAdminGuard)
  @Get()
  findAll(): Promise<AchievementResponseDto[]> {
    return this.achievementService.findAll();
  }

  @UseGuards(JwtAdminGuard)
  @Get('list')
  findAllWithFilters(
    @Query() filters: AchievementFilterDto,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<PaginatedAchievementsResponseDto> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.achievementService.findAllWithFilters(
      filters,
      pageNum,
      limitNum,
    );
  }

  @UseGuards(JwtAdminGuard)
  @Delete('code/:code')
  async removeByCode(@Param('code') code: string) {
    return this.achievementService.deleteByCode(code);
  }
}
