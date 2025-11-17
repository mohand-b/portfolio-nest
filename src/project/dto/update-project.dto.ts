import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  context?: string;

  @IsString()
  @IsOptional()
  collaboration?: string;

  @IsOptional()
  missions?: string[] | string;

  @IsOptional()
  skillIds?: string[] | string;

  @IsOptional()
  projectTypes?: string[] | string;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  @IsOptional()
  market?: string;

  @IsString()
  @IsOptional()
  challenges?: string;

  @IsString()
  @IsOptional()
  impact?: string;

  @IsOptional()
  isLinkedToJob?: boolean | string;

  @IsString()
  @IsOptional()
  jobId?: string;

  @IsString()
  @IsOptional()
  githubLink?: string;

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;
}
