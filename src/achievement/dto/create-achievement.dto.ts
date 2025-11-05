export class CreateAchievementDto {
  code: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  isActive?: boolean;
}
