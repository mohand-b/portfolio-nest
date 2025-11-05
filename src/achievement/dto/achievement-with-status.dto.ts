export class AchievementWithStatusDto {
  id: string;
  code: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive: boolean;
  unlocked: boolean;
}
