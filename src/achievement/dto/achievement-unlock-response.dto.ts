import { AchievementEntity } from '../achievement.entity';

export class AchievementUnlockResponseDto {
  success: boolean;
  achievement: AchievementEntity;
  alreadyUnlocked: boolean;
}
