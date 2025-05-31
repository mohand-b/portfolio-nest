import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

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

  @IsString()
  projectType: string;

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
}
