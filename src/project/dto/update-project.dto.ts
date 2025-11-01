import { IsDateString, IsOptional } from 'class-validator';

export class UpdateProjectDto {
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
