import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateMilestoneDto {
  @IsString()
  title: string;

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
