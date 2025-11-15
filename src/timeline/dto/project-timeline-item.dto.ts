import { Expose } from 'class-transformer';
import { BaseTimelineItemDto } from './base-timeline-item.dto';

export class ProjectTimelineItemDto extends BaseTimelineItemDto {
  @Expose()
  projectTypes: string[];

  @Expose()
  scope: string;

  @Expose()
  market: string;
}
