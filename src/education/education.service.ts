import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationEntity } from './education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { toValidDate } from '../utils/date.utils';
import { CertificationEntity } from '../certification/certification.entity';
import { parseJsonField } from '../utils/array.utils';
import { CertificationInputDto } from './dto/certification-input.dto';
import { bufferToBase64 } from '../utils/image.utils';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private readonly educationRepository: Repository<EducationEntity>,
    @InjectRepository(CertificationEntity)
    private readonly certificationRepository: Repository<CertificationEntity>,
  ) {}

  async create(dto: CreateEducationDto): Promise<any> {
    const education = this.educationRepository.create({
      title: dto.title,
      institution: dto.institution,
      location: dto.location,
      fieldOfStudy: dto.fieldOfStudy,
      description: dto.description,
      image: dto.image,
      type: TimelineItemTypeEnum.EDUCATION,
      startDate: toValidDate(dto.startDate),
      endDate: toValidDate(dto.endDate),
    });

    const certifications = parseJsonField<CertificationInputDto>(
      dto.certifications,
    );
    if (certifications.length > 0) {
      education.certifications = certifications.map((certDto) =>
        this.certificationRepository.create({
          title: certDto.title,
          certificationType: certDto.certificationType,
        }),
      );
    }

    const saved = await this.educationRepository.save(education);

    return {
      ...saved,
      image: bufferToBase64(saved.image),
    };
  }

  async update(id: string, dto: UpdateEducationDto): Promise<any> {
    const education = await this.educationRepository.findOne({
      where: { id },
      relations: ['certifications'],
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    if (dto.title !== undefined) education.title = dto.title;
    if (dto.institution !== undefined) education.institution = dto.institution;
    if (dto.location !== undefined) education.location = dto.location;
    if (dto.fieldOfStudy !== undefined)
      education.fieldOfStudy = dto.fieldOfStudy;
    if (dto.description !== undefined) education.description = dto.description;
    if (dto.image !== undefined) education.image = dto.image;
    if (dto.startDate !== undefined)
      education.startDate = toValidDate(dto.startDate);
    if (dto.endDate !== undefined) education.endDate = toValidDate(dto.endDate);

    if (dto.certifications !== undefined) {
      if (education.certifications?.length > 0) {
        await this.certificationRepository.remove(education.certifications);
      }

      const certifications = parseJsonField<CertificationInputDto>(
        dto.certifications,
      );
      education.certifications = certifications.map((certDto) =>
        this.certificationRepository.create({
          title: certDto.title,
          certificationType: certDto.certificationType,
        }),
      );
    }

    const saved = await this.educationRepository.save(education);

    return {
      ...saved,
      image: bufferToBase64(saved.image),
    };
  }

  async findAll(): Promise<any[]> {
    const educations = await this.educationRepository.find({
      relations: ['certifications'],
      order: { startDate: 'DESC' },
    });

    return educations.map((education) => ({
      ...education,
      image: bufferToBase64(education.image),
    }));
  }

  async findOne(id: string): Promise<any> {
    const education = await this.educationRepository.findOne({
      where: { id },
      relations: ['certifications'],
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    return {
      ...education,
      image: bufferToBase64(education.image),
    };
  }

  async delete(id: string): Promise<void> {
    const result = await this.educationRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }
  }

  async deleteAll(): Promise<void> {
    await this.educationRepository
      .createQueryBuilder()
      .delete()
      .from(EducationEntity)
      .execute();
  }
}
