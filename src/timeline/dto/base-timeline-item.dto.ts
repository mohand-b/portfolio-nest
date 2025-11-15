import { Expose } from 'class-transformer';
import { TimelineItemTypeEnum } from '../../common/enums/timeline-item-type.enum';

export class BaseTimelineItemDto {
  @Expose()
  id: string;

  @Expose()
  type: TimelineItemTypeEnum;

  @Expose()
  title: string;

  @Expose()
  startDate?: Date;

  @Expose()
  endDate?: Date;

  @Expose()
  description?: string;
}
