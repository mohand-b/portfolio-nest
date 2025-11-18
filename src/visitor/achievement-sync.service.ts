import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class AchievementSyncService {
  private _achievementUpdated = false;

  markAchievementUpdated(): void {
    this._achievementUpdated = true;
  }

  wasAchievementUpdated(): boolean {
    return this._achievementUpdated;
  }
}
