import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @IsString()
  title: string;

  @IsString()
  institution: string;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  fieldOfStudy?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  image?: Buffer;
}
