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
import { PaginatedVisitorsResponseDto } from './dto/paginated-visitors-response.dto';
import { VisitorStatsDto } from './dto/visitor-stats.dto';

@Controller('visitor')
export class VisitorController {
  constructor(private readonly visitorService: VisitorService) {}

  @Post()
  async authenticate(
    @Body() dto: VisitorDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Omit<VisitorAuthResponse, 'accessToken' | 'refreshToken'>> {
    const { accessToken, refreshToken, ...visitorProfile } =
      await this.visitorService.authenticate(dto);

    res.cookie('visitorAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('visitorRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return visitorProfile;
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const token = req.cookies['visitorRefreshToken'];
    const { accessToken } =
      await this.visitorService.refreshVisitorToken(token);

    res.cookie('visitorAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    return { message: 'Token rafraîchi' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response): { message: string } {
    res.clearCookie('visitorAccessToken');
    res.clearCookie('visitorRefreshToken');
    return { message: 'Déconnexion réussie' };
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
  @Get('stats')
  getStats(): Promise<VisitorStatsDto> {
    return this.visitorService.getStats();
  }

  @UseGuards(JwtAdminGuard)
  @Get('all')
  getAllVisitors(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<PaginatedVisitorsResponseDto> {
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    return this.visitorService.findAll(pageNum, limitNum);
  }
}
