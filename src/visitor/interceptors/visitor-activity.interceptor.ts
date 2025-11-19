import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { VisitorEntity } from './visitor.entity';
import { UserType } from '../common/enums/role.enum';
import { AchievementEntity } from '../achievement/achievement.entity';
import { AchievementUnlockLogEntity } from '../achievement-unlock-log/achievement-unlock-log.entity';
import { attachAchievementToRequest } from '../achievement/helpers/achievement-unlock.helper';

@Injectable()
export class VisitorActivityInterceptor implements NestInterceptor {
  private readonly lastUpdateMap = new Map<string, number>();
  private readonly UPDATE_THROTTLE_MS = 60000;

  constructor(
    @InjectRepository(VisitorEntity)
    private readonly visitorRepository: Repository<VisitorEntity>,
    @InjectRepository(AchievementEntity)
    private readonly achievementRepository: Repository<AchievementEntity>,
    @InjectRepository(AchievementUnlockLogEntity)
    private readonly achievementUnlockLogRepository: Repository<AchievementUnlockLogEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (user?.type === UserType.VISITOR && user.id) {
      const now = Date.now();
      const lastUpdate = this.lastUpdateMap.get(user.id);

      if (!lastUpdate || now - lastUpdate > this.UPDATE_THROTTLE_MS) {
        this.lastUpdateMap.set(user.id, now);
        this.updateLastVisit(user.id).catch(() => {});
        this.autoUnlockNightAchievement(user.id, request).catch(() => {});
      }
    }

    return next.handle();
  }

  private async updateLastVisit(visitorId: string): Promise<void> {
    await this.visitorRepository.update(
      { id: visitorId },
      { lastVisitAt: new Date() },
    );
  }

  private async autoUnlockNightAchievement(
    visitorId: string,
    request: Request,
  ): Promise<void> {
    const currentHour = new Date().getHours();
    const isNightTime = currentHour >= 12 || currentHour < 6;

    if (!isNightTime) {
      return;
    }

    try {
      const visitor = await this.visitorRepository.findOne({
        where: { id: visitorId },
        relations: ['achievements'],
      });

      if (!visitor) {
        return;
      }

      const nightAchievement = await this.achievementRepository.findOne({
        where: { code: 'NIGHT' },
      });

      if (!nightAchievement) {
        return;
      }

      const alreadyUnlocked = visitor.achievements.find(
        (a) => a.id === nightAchievement.id,
      );

      if (!alreadyUnlocked) {
        visitor.achievements.push(nightAchievement);
        await this.visitorRepository.save(visitor);
        await this.achievementUnlockLogRepository.save({
          visitor,
          achievement: nightAchievement,
        });

        attachAchievementToRequest(request, {
          success: true,
          achievement: nightAchievement,
          alreadyUnlocked: false,
        });
      }
    } catch (error) {}
  }
}
