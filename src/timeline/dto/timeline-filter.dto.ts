import { IsArray, IsEnum, IsOptional } from 'class-validator';
import { TimelineItemTypeEnum } from '../../common/enums/timeline-item-type.enum';
import { Type } from 'class-transformer';

export class TimelineFilterDto {
  @IsOptional()
  @IsArray()
  @IsEnum(TimelineItemTypeEnum, { each: true })
  @Type(() => String)
  types?: TimelineItemTypeEnum[];
}
