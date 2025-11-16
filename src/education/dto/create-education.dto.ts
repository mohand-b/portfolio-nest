import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CertificationInputDto } from './certification-input.dto';

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationInputDto)
  certifications?: CertificationInputDto[];
}
