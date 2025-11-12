import { AchievementResponseDto } from './achievement-response.dto';

export class PaginatedAchievementsResponseDto {
  data: AchievementResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
