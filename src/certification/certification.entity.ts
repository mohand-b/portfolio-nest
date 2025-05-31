import { Column, Entity } from 'typeorm';
import { TimelineItem } from '../timeline/timeline-item.entity';

@Entity()
export class Certification extends TimelineItem {
  @Column()
  school: string;

  @Column()
  location: string;
}
