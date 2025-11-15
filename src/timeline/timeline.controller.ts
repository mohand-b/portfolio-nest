import { Controller, Get, Query } from '@nestjs/common';
import { TimelineService } from './timeline.service';
import { TimelineFilterDto } from './dto/timeline-filter.dto';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @Get()
  async findAllTimeline(@Query() filters: TimelineFilterDto) {
    return this.timelineService.findAllTimeline(filters);
  }
}
