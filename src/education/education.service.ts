import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EducationEntity } from './education.entity';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { toValidDate } from '../utils/date.utils';

@Injectable()
export class EducationService {
  constructor(
    @InjectRepository(EducationEntity)
    private readonly educationRepository: Repository<EducationEntity>,
  ) {}

  async create(dto: CreateEducationDto): Promise<EducationEntity> {
    const education = this.educationRepository.create({
      ...dto,
      type: TimelineItemTypeEnum.EDUCATION,
      startDate: toValidDate(dto.startDate),
      endDate: toValidDate(dto.endDate),
    });

    return this.educationRepository.save(education);
  }

  async update(id: string, dto: UpdateEducationDto): Promise<EducationEntity> {
    const education = await this.educationRepository.findOneBy({ id });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    Object.assign(education, {
      ...dto,
      startDate: dto.startDate
        ? toValidDate(dto.startDate)
        : education.startDate,
      endDate: dto.endDate ? toValidDate(dto.endDate) : education.endDate,
    });

    return this.educationRepository.save(education);
  }

  async findAll(): Promise<EducationEntity[]> {
    return this.educationRepository.find({
      relations: ['certifications'],
      order: { startDate: 'DESC' },
    });
  }

  async findOne(id: string): Promise<EducationEntity> {
    const education = await this.educationRepository.findOne({
      where: { id },
      relations: ['certifications'],
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    return education;
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
