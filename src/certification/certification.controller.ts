import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { CertificationEntity } from './certification.entity';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';

@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @UseGuards(JwtAdminGuard)
  @Post()
  async create(
    @Body() dto: CreateCertificationDto,
  ): Promise<CertificationEntity> {
    return this.certificationService.create(dto);
  }

  @Get()
  async findAll(): Promise<CertificationEntity[]> {
    return this.certificationService.findAll();
  }
}
