import { Request } from 'express';
import { UserType } from '../../common/enums/role.enum';
import { AchievementEntity } from '../../achievement/achievement.entity';

export interface AuthenticatedUser {
  id: string;
  email: string;
  type: UserType;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User extends AuthenticatedUser {}

    interface Request {
      newlyUnlockedAchievements?: AchievementEntity[];
    }
  }
}
