import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
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
      throw new ConflictException(`La compétence "${dto.name}" existe déjà.`);
    }

    const skill = this.skillRepository.create(dto);
    return this.skillRepository.save(skill);
  }

  async findAll(): Promise<SkillEntity[]> {
    return this.skillRepository.find({
      order: { name: 'ASC' },
    });
  }

  async search(query: string, limit: number = 10): Promise<SkillEntity[]> {
    return this.skillRepository
      .createQueryBuilder('skill')
      .where('LOWER(skill.name) LIKE LOWER(:query)', { query: `%${query}%` })
      .orderBy('skill.name', 'ASC')
      .limit(limit)
      .getMany();
  }

  async updateCategory(id: string, category: string): Promise<SkillEntity> {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) throw new BadRequestException('Compétence non trouvée');
    if (skill.category === category) {
      throw new BadRequestException(
        'La compétence est déjà dans cette catégorie.',
      );
    }
    skill.category = category;
    return this.skillRepository.save(skill);
  }

  async updateLevel(id: string, newLevel: number): Promise<SkillEntity> {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) throw new BadRequestException('Compétence non trouvée');
    if (skill.level === newLevel) {
      throw new BadRequestException('La compétence a déjà ce niveau.');
    }
    skill.level = newLevel;
    return this.skillRepository.save(skill);
  }

  async delete(id: string): Promise<void> {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) throw new BadRequestException('Compétence non trouvée');
    await this.skillRepository.delete(id);
  }
}
