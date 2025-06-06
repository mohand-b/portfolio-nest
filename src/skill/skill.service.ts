import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SkillEntity } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(SkillEntity)
    private readonly skillRepository: Repository<SkillEntity>,
  ) {}

  async create(dto: CreateSkillDto): Promise<SkillEntity> {
    const existing = await this.skillRepository.findOneBy({ name: dto.name });

    if (existing) {
      throw new BadRequestException(`La compétence "${dto.name}" existe déjà.`);
    }

    const skill = this.skillRepository.create(dto);
    return this.skillRepository.save(skill);
  }

  async findAll(): Promise<SkillEntity[]> {
    return this.skillRepository.find({
      order: { name: 'ASC' },
    });
  }
}
