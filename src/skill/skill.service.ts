import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from './skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
  ) {}

  async create(dto: CreateSkillDto): Promise<Skill> {
    const existing = await this.skillRepo.findOneBy({ name: dto.name });

    if (existing) {
      throw new BadRequestException(`La compétence "${dto.name}" existe déjà.`);
    }

    const skill = this.skillRepo.create(dto);
    return this.skillRepo.save(skill);
  }

  async findAll(): Promise<Skill[]> {
    return this.skillRepo.find({
      order: { name: 'ASC' },
    });
  }
}
