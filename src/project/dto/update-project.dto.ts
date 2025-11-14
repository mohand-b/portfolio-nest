import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  missions?: string[];

  @IsUUID('all', { each: true })
  @IsOptional()
  skillIds?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  projectTypes?: string[];

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

  @IsUUID()
  @IsOptional()
  jobId?: string;

  @IsString()
  @IsOptional()
  githubLink?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
