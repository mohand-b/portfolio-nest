import { Column, Entity, OneToMany } from 'typeorm';
import { TimelineItem } from '../timeline/timeline-item.entity';
import { Project } from '../project/project.entity';

@Entity()
export class Job extends TimelineItem {
  @Column()
  company: string;

  @Column({ nullable: true })
  location: string;

  @Column('text', { array: true })
  missions: string[];

  @OneToMany(() => Project, (project) => project.job, { cascade: true })
  projects: Project[];
}
