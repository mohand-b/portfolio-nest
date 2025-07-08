import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { CertificationEntity } from './certification.entity';
import { JwtAdminGuard } from '../core/guards/jwt-admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('certifications')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post('create')
  @UseGuards(JwtAdminGuard)
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateCertificationDto,
  ): Promise<CertificationEntity> {
    if (file && file.buffer) {
      dto.image = file.buffer;
    }
    return this.certificationService.create(dto);
  }

  @Get()
  async findAll(): Promise<CertificationEntity[]> {
    return this.certificationService.findAll();
  }
}
