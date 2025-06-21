import { BadRequestException, Injectable } from '@nestjs/common';
import { AchievementEntity } from './achievement.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(AchievementEntity)
    private achievementRepository: Repository<AchievementEntity>,
  ) {}

  async create(dto: CreateAchievementDto) {
    const exists = await this.achievementRepository.findOneBy({
      code: dto.code,
    });
    if (exists) {
      throw new BadRequestException(
        `Un succès avec le code « ${dto.code} » existe déjà.`,
      );
    }

    const achievement = this.achievementRepository.create(dto);
    return this.achievementRepository.save(achievement);
  }

  findAll(): Promise<AchievementEntity[]> {
    return this.achievementRepository.find();
  }

  async deleteByCode(code: string): Promise<AchievementEntity> {
    const achievement = await this.achievementRepository.findOneBy({ code });
    if (!achievement) {
      throw new BadRequestException(
        `Aucun succès trouvé avec le code « ${code} ».`,
      );
    }
    await this.achievementRepository.delete({ code });
    return achievement;
  }
}
