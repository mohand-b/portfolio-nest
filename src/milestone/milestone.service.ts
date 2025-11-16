import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MilestoneEntity } from './milestone.entity';
import { CreateMilestoneDto } from './dto/create-milestone.dto';
import { UpdateMilestoneDto } from './dto/update-milestone.dto';
import { MilestoneResponseDto } from './dto/milestone-response.dto';
import { TimelineItemTypeEnum } from '../common/enums/timeline-item-type.enum';
import { toValidDate } from '../utils/date.utils';
import { bufferToBase64 } from '../utils/image.utils';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectRepository(MilestoneEntity)
    private readonly milestoneRepository: Repository<MilestoneEntity>,
  ) {}

  private toDto(milestone: MilestoneEntity): MilestoneResponseDto {
    return plainToInstance(MilestoneResponseDto, {
      ...milestone,
      image: bufferToBase64(milestone.image),
    });
  }

  async create(dto: CreateMilestoneDto): Promise<MilestoneResponseDto> {
    const milestone = this.milestoneRepository.create({
      ...dto,
      type: TimelineItemTypeEnum.MILESTONE,
      startDate: toValidDate(dto.startDate),
      endDate: toValidDate(dto.endDate),
    });

    const saved = await this.milestoneRepository.save(milestone);
    return this.toDto(saved);
  }

  async update(
    id: string,
    dto: UpdateMilestoneDto,
  ): Promise<MilestoneResponseDto> {
    const milestone = await this.milestoneRepository.findOne({ where: { id } });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    if (dto.title !== undefined) milestone.title = dto.title;
    if (dto.description !== undefined) milestone.description = dto.description;
    if (dto.image !== undefined) milestone.image = dto.image;
    if (dto.startDate !== undefined)
      milestone.startDate = toValidDate(dto.startDate);
    if (dto.endDate !== undefined)
      milestone.endDate = toValidDate(dto.endDate);

    const saved = await this.milestoneRepository.save(milestone);
    return this.toDto(saved);
  }

  async findAll(): Promise<MilestoneResponseDto[]> {
    const milestones = await this.milestoneRepository.find({
      order: { startDate: 'DESC' },
    });

    return milestones.map((m) => this.toDto(m));
  }

  async findOne(id: string): Promise<MilestoneResponseDto> {
    const milestone = await this.milestoneRepository.findOne({ where: { id } });

    if (!milestone) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }

    return this.toDto(milestone);
  }

  async delete(id: string): Promise<void> {
    const result = await this.milestoneRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Milestone with ID ${id} not found`);
    }
  }

  async deleteAll(): Promise<void> {
    await this.milestoneRepository
      .createQueryBuilder()
      .delete()
      .from(MilestoneEntity)
      .execute();
  }
}
