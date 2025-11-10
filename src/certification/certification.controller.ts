import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { CertificationEntity } from './certification.entity';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';

@Controller('certifications')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post('create')
  @UseGuards(JwtAdminGuard)
  async create(
    @Body() dto: CreateCertificationDto,
  ): Promise<CertificationEntity> {
    return this.certificationService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAdminGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCertificationDto,
  ): Promise<CertificationEntity> {
    return this.certificationService.update(id, dto);
  }

  @Get()
  async findAll(): Promise<CertificationEntity[]> {
    return this.certificationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<CertificationEntity> {
    return this.certificationService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAdminGuard)
  async delete(@Param('id') id: string): Promise<{ message: string }> {
    await this.certificationService.delete(id);
    return { message: 'Certification deleted successfully' };
  }

  @Delete('all')
  @UseGuards(JwtAdminGuard)
  async deleteAll(): Promise<{ message: string }> {
    await this.certificationService.deleteAll();
    return { message: 'All certifications deleted successfully' };
  }
}
