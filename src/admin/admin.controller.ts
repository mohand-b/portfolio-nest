import { Body, Controller, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { LoginAdminDto } from './dto/login-admin.dto/login-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  async login(@Body() dto: LoginAdminDto) {
    return this.adminService.login(dto);
  }

  @Post('create')
  async createAdmin(@Body() dto: any) {
    return this.adminService.createAdmin(dto);
  }
}
