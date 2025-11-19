import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class AchievementResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        try {
          const request = context.switchToHttp().getRequest<Request>();
          const newlyUnlocked = request.newlyUnlockedAchievements;

          if (
            !newlyUnlocked ||
            !Array.isArray(newlyUnlocked) ||
            newlyUnlocked.length === 0
          ) {
            return data;
          }

          if (data === null || data === undefined) {
            return {
              _achievements: newlyUnlocked,
            };
          }

          if (typeof data === 'object' && !Array.isArray(data)) {
            return {
              ...data,
              _achievements: newlyUnlocked,
            };
          }

          return {
            data,
            _achievements: newlyUnlocked,
          };
        } catch (error) {
          return data;
        }
      }),
    );
  }
}
