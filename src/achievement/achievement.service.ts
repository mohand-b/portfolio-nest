import { BadRequestException, Injectable } from '@nestjs/common';
import { AchievementEntity } from './achievement.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { AchievementResponseDto } from './dto/achievement-response.dto';
import { AchievementStatsDto } from './dto/achievement-stats.dto';
import { VisitorEntity } from '../visitor/visitor.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(AchievementEntity)
    private achievementRepository: Repository<AchievementEntity>,
    @InjectRepository(VisitorEntity)
    private visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(AchievementUnlockLogEntity)
    private achievementUnlockLogRepository: Repository<AchievementUnlockLogEntity>,
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

  async findAll(): Promise<AchievementResponseDto[]> {
    const achievements = await this.achievementRepository.find({
      relations: ['visitors'],
    });

    return achievements.map((achievement) => ({
      id: achievement.id,
      code: achievement.code,
      label: achievement.label,
      description: achievement.description,
      color: achievement.color,
      icon: achievement.icon,
      isActive: achievement.isActive,
      createdAt: achievement.createdAt,
      unlockedCount: achievement.visitors?.length || 0,
    }));
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

  async getStats(): Promise<AchievementStatsDto> {
    const totalVisitors = await this.visitorRepository.count();
    const totalActiveAchievements = await this.achievementRepository.count({
      where: { isActive: true },
    });

    const totalUnlocked = await this.achievementUnlockLogRepository
      .createQueryBuilder('log')
      .innerJoin('log.achievement', 'achievement')
      .where('achievement.isActive = :isActive', { isActive: true })
      .getCount();

    const maxPossibleUnlocks = totalVisitors * totalActiveAchievements;
    const completionRate =
      maxPossibleUnlocks > 0 ? (totalUnlocked / maxPossibleUnlocks) * 100 : 0;

    return {
      totalUnlocked,
      completionRate: Math.round(completionRate * 100) / 100,
      totalActiveAchievements,
    };
  }
}
