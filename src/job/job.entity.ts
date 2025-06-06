import { Column, Entity, OneToMany } from 'typeorm';
import { TimelineItem } from '../timeline/timeline-item.entity';
import { ProjectEntity } from '../project/project.entity';

@Entity()
export class JobEntity extends TimelineItem {
  @Column()
  company: string;

  @Column({ nullable: true })
  location: string;

  @Column('text', { array: true })
  missions: string[];

  @OneToMany(() => ProjectEntity, (project) => project.job, {
    cascade: true,
  })
  projects: ProjectEntity[];
}
