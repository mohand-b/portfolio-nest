import { Entity } from 'typeorm';
import { TimelineItem } from '../timeline/timeline-item.entity';

@Entity()
export class MilestoneEntity extends TimelineItem {}
