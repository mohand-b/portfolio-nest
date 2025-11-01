import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsString()
  context: string;

  @IsString()
  @IsOptional()
  collaboration?: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];

  @IsArray()
  @IsString({ each: true })
  tools: string[];

  @IsUUID('all', { each: true })
  @IsOptional()
  skillIds?: string[];

  @IsArray()
  @IsString({ each: true })
  projectTypes: string[];

  @IsString()
  scope: string;

  @IsString()
  market: string;

  @IsString()
  @IsOptional()
  challenges?: string;

  @IsString()
  @IsOptional()
  impact?: string;

  @IsUUID()
  @IsOptional()
  jobId?: string;

  @IsOptional()
  images?: Buffer[];

  @IsString()
  @IsOptional()
  githubLink?: string;
}
