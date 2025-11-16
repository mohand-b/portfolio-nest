import { Expose, Type } from 'class-transformer';
import { BaseTimelineItemDto } from './base-timeline-item.dto';
import { CertificationLightDto } from './certification-light.dto';

export class EducationTimelineItemDto extends BaseTimelineItemDto {
  @Expose()
  institution: string;

  @Expose()
  location: string;

  @Expose()
  fieldOfStudy?: string;

  @Expose()
  @Type(() => CertificationLightDto)
  certifications: CertificationLightDto[];

  @Expose()
  image?: string;
}
