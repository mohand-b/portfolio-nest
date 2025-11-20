import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { VisitorEntity } from '../visitor.entity';
import { UserType } from '../../common/enums/role.enum';
import { AchievementAutoUnlockService } from '../../achievement/services/achievement-auto-unlock.service';

@Injectable()
export class VisitorActivityInterceptor implements NestInterceptor {
  private readonly lastUpdateMap = new Map<string, number>();
  private readonly UPDATE_THROTTLE_MS = 60000;

  constructor(
    @InjectRepository(VisitorEntity)
    private readonly visitorRepository: Repository<VisitorEntity>,
    private readonly achievementAutoUnlockService: AchievementAutoUnlockService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>();
    const { user } = request;

    if (user?.type === UserType.VISITOR && user.id) {
      const now = Date.now();
      const lastUpdate = this.lastUpdateMap.get(user.id);

      if (!lastUpdate || now - lastUpdate > this.UPDATE_THROTTLE_MS) {
        this.lastUpdateMap.set(user.id, now);
        this.updateLastVisit(user.id);
        this.achievementAutoUnlockService.checkAndUnlockNightAchievement(
          user.id,
          request,
        );
      }
    }

    return next.handle();
  }

  private async updateLastVisit(visitorId: string): Promise<void> {
    await this.visitorRepository.update({ id: visitorId }, { lastVisitAt: new Date() });
  }
}
