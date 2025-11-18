import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AchievementSyncService } from '../../visitor/achievement-sync.service';
import { Request, Response } from 'express';

@Injectable()
export class AchievementSyncInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(async () => {
        try {
          const request = context.switchToHttp().getRequest<Request>();
          const contextId = ContextIdFactory.getByRequest(request);

          const achievementSyncService = await this.moduleRef.resolve(
            AchievementSyncService,
            contextId,
          );

          if (achievementSyncService.wasAchievementUpdated()) {
            const response = context.switchToHttp().getResponse<Response>();
            response.setHeader('X-Achievement-Updated', 'true');
          }
        } catch (error) {}
      }),
    );
  }
}
