import { VisitorResponseDto } from './visitor-response.dto';

export class PaginatedVisitorsResponseDto {
  data: VisitorResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
