import { BadRequestException, Injectable } from '@nestjs/common';
import { AchievementEntity } from './achievement.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAchievementDto } from './dto/create-achievement.dto';
import { UpdateAchievementDto } from './dto/update-achievement.dto';
import { AchievementResponseDto } from './dto/achievement-response.dto';
import { AchievementStatsDto } from './dto/achievement-stats.dto';
import { AchievementFilterDto } from './dto/achievement-filter.dto';
import { PaginatedAchievementsResponseDto } from './dto/paginated-achievements-response.dto';
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

  async update(
    code: string,
    dto: UpdateAchievementDto,
  ): Promise<AchievementEntity> {
    const achievement = await this.achievementRepository.findOneBy({ code });
    if (!achievement) {
      throw new BadRequestException(
        `Aucun succès trouvé avec le code « ${code} ».`,
      );
    }

    Object.assign(achievement, dto);
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

  async findAllWithFilters(
    filters: AchievementFilterDto,
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedAchievementsResponseDto> {
    const skip = (page - 1) * limit;

    const queryBuilder = this.achievementRepository
      .createQueryBuilder('achievement')
      .leftJoinAndSelect('achievement.visitors', 'visitor');

    if (filters.label) {
      queryBuilder.andWhere('LOWER(achievement.label) LIKE LOWER(:label)', {
        label: `%${filters.label}%`,
      });
    }

    if (filters.isActive !== undefined) {
      queryBuilder.andWhere('achievement.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    const total = await queryBuilder.getCount();

    const achievements = await queryBuilder
      .orderBy('achievement.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const data = achievements.map((achievement) => ({
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

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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
