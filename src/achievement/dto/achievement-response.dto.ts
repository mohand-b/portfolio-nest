export class AchievementResponseDto {
  id: string;
  code: string;
  label: string;
  description?: string;
  color?: string;
  icon?: string;
  isActive: boolean;
  createdAt: Date;
  unlockedCount: number;
}
