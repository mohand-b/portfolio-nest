import { ProjectLightResponseDto } from './project-light-response.dto';

export class PaginatedProjectsLightResponseDto {
  data: ProjectLightResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
