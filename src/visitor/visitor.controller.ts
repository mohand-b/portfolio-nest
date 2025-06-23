import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { VisitorService } from './visitor.service';
import { VisitorDto } from './dto/visitor.dto';
import { JwtVisitorGuard } from '../core/guards/jwt-visitor.guard';
import { AchievementWithStatusDto } from '../achievement/dto/achievement-with-status.dto';
import { AchievementUnlockResponseDto } from '../achievement/dto/achievement-unlock-response.dto';
import { Response } from 'express';
import { VisitorAuthResponse } from './dto/visitor-auth-response.dto';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  async authenticate(
    @Body() dto: VisitorDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<VisitorAuthResponse> {
    const fullResponse = await this.visitorService.authenticate(dto);
    const { accessToken, ...visitorProfile } = fullResponse;

    res.cookie('visitorAccessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return visitorProfile;
  }

  @Get('verify')
  async verify(@Query('token') token: string): Promise<{ message: string }> {
    const success = await this.visitorService.verifyEmail(token);
    if (!success) throw new BadRequestException('Token invalide ou expiré.');
    return { message: 'Email vérifié avec succès.' };
  }

  @UseGuards(JwtVisitorGuard)
  @Post('achievements/unlock/:code')
  unlock(
    @Param('code') code: string,
    @Req() req: any,
  ): Promise<AchievementUnlockResponseDto> {
    return this.visitorService.unlockAchievement(req.user.id, code);
  }

  @UseGuards(JwtVisitorGuard)
  @Get('achievements')
  getAchievementsForVisitor(
    @Req() req: any,
  ): Promise<AchievementWithStatusDto[]> {
    return this.visitorService.getAchievementsForVisitor(req.user.id);
  }

  @UseGuards(JwtAdminGuard)
  @Get('all')
  getAllVisitors(): Promise<VisitorDto[]> {
    return this.visitorService.findAll();
  }
}
