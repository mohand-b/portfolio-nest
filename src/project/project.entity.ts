import { Column, Entity, ManyToOne } from 'typeorm';
import { TimelineItem } from '../timeline/timeline-item.entity';
import { Job } from '../job/job.entity';

@Entity()
export class Project extends TimelineItem {
  @Column()
  context: string;

  @Column({ nullable: true })
  collaboration: string;

  @Column('text', { array: true })
  missions: string[];

  @Column('text', { array: true })
  tools: string[];

  @Column()
  projectType: string;

  @Column()
  scope: string;

  @Column()
  market: string;

  @Column({ nullable: true, type: 'text' })
  challenges: string;

  @Column({ nullable: true, type: 'text' })
  impact: string;

  @ManyToOne(() => Job, (job) => job.projects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  job?: Job;
}
