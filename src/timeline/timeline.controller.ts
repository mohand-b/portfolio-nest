import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TimelineService } from './timeline.service';
import { TimelineFilterDto } from './dto/timeline-filter.dto';
import { OptionalJwtVisitorGuard } from '../core/guards/optional-jwt-visitor.guard';

@Controller('timeline')
export class TimelineController {
  constructor(private readonly timelineService: TimelineService) {}

  @UseGuards(OptionalJwtVisitorGuard)
  @Get()
  async findAllTimeline(
    @Query() filters: TimelineFilterDto,
    @Req() request: Request,
  ) {
    return this.timelineService.findAllTimeline(filters, request);
  }
}
