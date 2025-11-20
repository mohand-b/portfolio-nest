import { JobTimelineItemDto } from './job-timeline-item.dto';
import { ProjectTimelineItemDto } from './project-timeline-item.dto';
import { EducationTimelineItemDto } from './education-timeline-item.dto';
import { BaseTimelineItemDto } from './base-timeline-item.dto';

type TimelineItemDto =
  | JobTimelineItemDto
  | ProjectTimelineItemDto
  | EducationTimelineItemDto
  | BaseTimelineItemDto;

export class TimelineResponseDto {
  data: TimelineItemDto[];
}
