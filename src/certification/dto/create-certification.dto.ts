import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateCertificationDto {
  @IsString()
  certificationName: string;

  @IsDateString()
  @IsOptional()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate: string;

  @IsString()
  school: string;

  @IsString()
  location: string;

  @IsOptional()
  image?: Buffer;
}
