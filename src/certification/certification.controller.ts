import { Body, Controller, Get, Post } from '@nestjs/common';
import { CertificationService } from './certification.service';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { Certification } from './certification.entity';

@Controller('certification')
export class CertificationController {
  constructor(private readonly certificationService: CertificationService) {}

  @Post()
  async create(@Body() dto: CreateCertificationDto): Promise<Certification> {
    return this.certificationService.create(dto);
  }

  @Get()
  async findAll(): Promise<Certification[]> {
    return this.certificationService.findAll();
  }
}
