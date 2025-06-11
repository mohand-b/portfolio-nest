import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AchievementUnlockLogDto } from './dto/achievement-unlock-log.dto';
import { AchievementUnlockLogEntity } from './achievement-unlock-log.entity';

@Injectable()
export class AchievementUnlockLogService {
  constructor(
    @InjectRepository(AchievementUnlockLogEntity)
    private readonly achievementUnlockLogRepository: Repository<AchievementUnlockLogEntity>,
  ) {}

  async findAll(): Promise<AchievementUnlockLogDto[]> {
    const logs = await this.achievementUnlockLogRepository.find({
      order: { unlockedAt: 'DESC' },
      relations: ['visitor', 'achievement'],
    });

    return logs.map((log) => ({
      id: log.id,
      unlockedAt: log.unlockedAt,
      visitorId: log.visitor.id,
      visitorName: log.visitor.firstName + ' ' + log.visitor.lastName,
      achievementId: log.achievement.id,
      achievementCode: log.achievement.code,
      achievementLabel: log.achievement.label,
    }));
  }
}
