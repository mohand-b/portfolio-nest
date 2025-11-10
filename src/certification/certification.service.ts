import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CertificationEntity } from './certification.entity';
import { CreateCertificationDto } from './dto/create-certification.dto';
import { UpdateCertificationDto } from './dto/update-certification.dto';
import { EducationEntity } from '../education/education.entity';

@Injectable()
export class CertificationService {
  constructor(
    @InjectRepository(CertificationEntity)
    private readonly certificationRepository: Repository<CertificationEntity>,
    @InjectRepository(EducationEntity)
    private readonly educationRepository: Repository<EducationEntity>,
  ) {}

  async create(dto: CreateCertificationDto): Promise<CertificationEntity> {
    const education = await this.educationRepository.findOneBy({
      id: dto.educationId,
    });

    if (!education) {
      throw new NotFoundException(
        `Education with ID ${dto.educationId} not found`,
      );
    }

    const certification = this.certificationRepository.create({
      ...dto,
      education,
    });

    return this.certificationRepository.save(certification);
  }

  async update(
    id: string,
    dto: UpdateCertificationDto,
  ): Promise<CertificationEntity> {
    const certification = await this.certificationRepository.findOneBy({ id });

    if (!certification) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }

    Object.assign(certification, dto);

    if (dto.educationId) {
      const education = await this.educationRepository.findOneBy({
        id: dto.educationId,
      });
      if (!education) {
        throw new NotFoundException(
          `Education with ID ${dto.educationId} not found`,
        );
      }
      certification.education = education;
    }

    return this.certificationRepository.save(certification);
  }

  async findAll(): Promise<CertificationEntity[]> {
    return this.certificationRepository.find({
      relations: ['education'],
    });
  }

  async findOne(id: string): Promise<CertificationEntity> {
    const certification = await this.certificationRepository.findOne({
      where: { id },
      relations: ['education'],
    });

    if (!certification) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }

    return certification;
  }

  async delete(id: string): Promise<void> {
    const result = await this.certificationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Certification with ID ${id} not found`);
    }
  }

  async deleteAll(): Promise<void> {
    await this.certificationRepository.clear();
  }
}
