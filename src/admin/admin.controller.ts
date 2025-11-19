import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto/login-admin.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Response, Request } from 'express';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';
import { AuthenticatedRequest } from '../core/types/request.types';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(
    @Body() dto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { accessToken, refreshToken } = await this.adminService.login(dto);

    res.cookie('adminAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    res.cookie('adminRefreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Connexion réussie' };
  }

  @Post('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['adminRefreshToken'];
    const { accessToken } =
      await this.adminService.refreshAdminToken(refreshToken);

    res.cookie('adminAccessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    return { message: 'Token rafraîchi' };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('adminAccessToken');
    res.clearCookie('adminRefreshToken');
    return { message: 'Admin déconnecté' };
  }

  @UseGuards(JwtAdminGuard)
  @Get('me')
  async getAdminProfile(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  @Post('create')
  async createAdmin(@Body() dto: CreateAdminDto) {
    return this.adminService.createAdmin(dto);
  }
}
