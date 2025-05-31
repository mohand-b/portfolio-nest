import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  company: string;

  @IsString()
  location: string;

  @IsArray()
  @IsString({ each: true })
  missions: string[];
}
