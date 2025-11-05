import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AchievementUnlockLogService } from './achievement-unlock-log.service';
import { AchievementUnlockLogDto } from './dto/achievement-unlock-log.dto';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';

@Controller('admin/achievement-unlock-logs')
export class AchievementUnlockLogController {
  constructor(
    private readonly achievementUnlockLogService: AchievementUnlockLogService,
  ) {}

  @UseGuards(JwtAdminGuard)
  @Get()
  findAll(): Promise<AchievementUnlockLogDto[]> {
    return this.achievementUnlockLogService.findAll();
  }

  @UseGuards(JwtAdminGuard)
  @Get('achievement/:code')
  findByAchievementCode(
    @Param('code') code: string,
  ): Promise<AchievementUnlockLogDto[]> {
    return this.achievementUnlockLogService.findByAchievementCode(code);
  }
}
