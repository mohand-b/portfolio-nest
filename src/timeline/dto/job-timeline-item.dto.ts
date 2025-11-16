import { Expose } from 'class-transformer';
import { BaseTimelineItemDto } from './base-timeline-item.dto';

export class JobTimelineItemDto extends BaseTimelineItemDto {
  @Expose()
  company: string;

  @Expose()
  location: string;

  @Expose()
  missions: string[];

  @Expose()
  image?: string;
}
