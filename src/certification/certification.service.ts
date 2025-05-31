// src/certification/certification.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Certification } from './certification.entity';
import { Repository } from 'typeorm';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(Certification)
    private readonly certificationRepo: Repository<Certification>,
  ) {}

  async create(dto: CreateCertificationDto): Promise<Certification> {
    const certification = this.certificationRepo.create({
      title: dto.certificationName,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      school: dto.school,
      type: TimelineItemTypeEnum.CERTIFICATION,
      location: dto.location,
    });

    return this.certificationRepo.save(certification);
  }

  async findAll(): Promise<Certification[]> {
    return this.certificationRepo.find({
      order: { endDate: 'DESC' },
    });
  }
}
