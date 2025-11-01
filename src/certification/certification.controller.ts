import {
  Body,
  Controller,
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

  async findAll(): Promise<any[]> {
    const certifications = await this.certificationRepository.find({
      order: { endDate: 'DESC' },
    });

    return certifications.map((cert) => ({
      ...cert,
      image: bufferToBase64(cert.image),
    }));
  }
}
