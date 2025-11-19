import { Request } from 'express';
import { AchievementUnlockResponseDto } from '../dto/achievement-unlock-response.dto';

export function attachAchievementToRequest(
  request: Request,
  achievementResult: AchievementUnlockResponseDto | null,
): void {
  if (
    !achievementResult ||
    !achievementResult.success ||
    achievementResult.alreadyUnlocked
  ) {
    return;
  }

  if (!request.newlyUnlockedAchievements) {
    request.newlyUnlockedAchievements = [];
  }

  request.newlyUnlockedAchievements.push(achievementResult.achievement);
}
