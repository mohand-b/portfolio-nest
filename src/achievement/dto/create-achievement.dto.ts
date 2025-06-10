import { IsString, IsOptional } from 'class-validator';

export class CreateAchievementDto {
  @IsString()
  code: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  description?: string;
}
