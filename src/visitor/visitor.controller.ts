import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorDto } from './dto/visitor.dto/visitor.dto';
import { AchievementEntity } from '../achievement/achievement.entity';
import { JwtVisitorGuard } from '../core/guards/jwt-visitor.guard';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  async authenticate(@Body() dto: VisitorDto) {
    return this.visitorService.authenticate(dto);
  }

  @Get('verify')
  async verify(@Query('token') token: string) {
    const success = await this.visitorService.verifyEmail(token);
    if (!success) throw new BadRequestException('Token invalide ou expiré.');
    return { message: 'Email vérifié avec succès.' };
  }

  @UseGuards(JwtVisitorGuard)
  @Post('achievements/:achievementCode')
  async addAchievement(
    @Param('achievementCode') achievementCode: string,
    @Req() req: any,
  ) {
    const userId = req.user.id;
    return this.visitorService.addAchievementToVisitor(userId, achievementCode);
  }

  @UseGuards(JwtVisitorGuard)
  @Get('achievements')
  async getAchievements(@Req() req: any): Promise<AchievementEntity[]> {
    const userId = req.user.id;
    return this.visitorService.getAchievementsForVisitor(userId);
  }
}
