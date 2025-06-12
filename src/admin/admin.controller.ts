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
import { Response } from 'express';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(
    @Body() dto: LoginAdminDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    const { accessToken } = await this.adminService.login(dto);

    res.cookie('adminAccessToken', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return { message: 'Connexion réussie' };
  }

  @UseGuards(JwtAdminGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return req.user;
  }

  @Post('create')
  async createAdmin(@Body() dto: any) {
    return this.adminService.createAdmin(dto);
  }
}
