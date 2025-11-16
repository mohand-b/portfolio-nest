import { Expose, Type } from 'class-transformer';
import { BaseTimelineItemDto } from './base-timeline-item.dto';
import { SkillLightDto } from './skill-light.dto';

export class ProjectTimelineItemDto extends BaseTimelineItemDto {
  @Expose()
  projectTypes: string[];

  @Expose()
  scope: string;

  @Expose()
  market: string;

  @Expose()
  @Type(() => SkillLightDto)
  skills: SkillLightDto[];
}
