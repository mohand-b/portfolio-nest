import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { VisitorEntity } from '../../visitor/visitor.entity';
import { AchievementEntity } from '../achievement.entity';
import { AchievementUnlockLogEntity } from '../../achievement-unlock-log/achievement-unlock-log.entity';
import { attachAchievementToRequest } from '../helpers/achievement-unlock.helper';

@Injectable()
export class AchievementAutoUnlockService {
  constructor(
    @InjectRepository(VisitorEntity)
    private readonly visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(AchievementEntity)
    private readonly achievementRepository: Repository<AchievementEntity>,
    @InjectRepository(AchievementUnlockLogEntity)
    private readonly achievementUnlockLogRepository: Repository<AchievementUnlockLogEntity>,
  ) {}

  async checkAndUnlock(
    visitorId: string,
    achievementCode: string,
    request?: Request,
  ): Promise<boolean> {
    try {
      const visitor = await this.visitorRepository.findOne({
        where: { id: visitorId },
        relations: ['achievements'],
      });

      if (!visitor) return false;

      const achievement = await this.achievementRepository.findOne({
        where: { code: achievementCode },
      });

      if (!achievement) return false;

      const alreadyUnlocked = visitor.achievements.some(
        (a) => a.id === achievement.id,
      );

      if (alreadyUnlocked) return false;

      visitor.achievements.push(achievement);
      await this.visitorRepository.save(visitor);
      await this.achievementUnlockLogRepository.save({
        visitor,
        achievement,
      });

      if (request) {
        attachAchievementToRequest(request, {
          success: true,
          achievement,
          alreadyUnlocked: false,
        });
      }

      return true;
    } catch {
      return false;
    }
  }

  async checkAndUnlockNightAchievement(
    visitorId: string,
    request?: Request,
  ): Promise<boolean> {
    const currentHour = new Date().getHours();
    const isNightTime = currentHour >= 12 || currentHour < 6;
    return isNightTime
      ? this.checkAndUnlock(visitorId, 'NIGHT', request)
      : false;
  }
}
