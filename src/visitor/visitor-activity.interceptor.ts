import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitorEntity } from './visitor.entity';
import { UserType } from '../common/enums/role.enum';

@Injectable()
export class VisitorActivityInterceptor implements NestInterceptor {
  private readonly lastUpdateMap = new Map<string, number>();
  private readonly UPDATE_THROTTLE_MS = 60000;

  constructor(
    @InjectRepository(VisitorEntity)
    private readonly visitorRepository: Repository<VisitorEntity>,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const user = context.switchToHttp().getRequest().user;

    if (user?.type === UserType.VISITOR && user.sub) {
      const now = Date.now();
      const lastUpdate = this.lastUpdateMap.get(user.sub);

      if (!lastUpdate || now - lastUpdate > this.UPDATE_THROTTLE_MS) {
        this.lastUpdateMap.set(user.sub, now);
        this.updateLastVisit(user.sub).catch(() => {});
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
}
