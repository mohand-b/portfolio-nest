import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CertificationEntity } from './certification.entity';
import { Repository } from 'typeorm';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(CertificationEntity)
    private readonly certificationRepository: Repository<CertificationEntity>,
  ) {}

  async create(dto: CreateCertificationDto): Promise<CertificationEntity> {
    const certification = this.certificationRepository.create({
      title: dto.certificationName,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      school: dto.school,
      type: TimelineItemTypeEnum.CERTIFICATION,
      location: dto.location,
    });

    return this.certificationRepository.save(certification);
  }

  async findAll(): Promise<CertificationEntity[]> {
    return this.certificationRepository.find({
      order: { endDate: 'DESC' },
    });
  }
}
