import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { TimelineItem } from '../timeline/timeline-item.entity';
import { JobEntity } from '../job/job.entity';
import { SkillEntity } from '../skill/skill.entity';

@Entity()
export class ProjectEntity extends TimelineItem {
  @Column()
  context: string;

  @Column({ nullable: true })
  collaboration: string;

  @Column('text', { array: true })
  missions: string[];

  @Column('text', { array: true })
  tools: string[];

  @ManyToMany(() => SkillEntity, { cascade: true })
  @JoinTable()
  skills: SkillEntity[];

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

  @ManyToOne(() => JobEntity, (job) => job.projects, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  job?: JobEntity;

  @Column({ nullable: true })
  githubLink: string;

  @Column('bytea', { array: true, nullable: true })
  images?: Buffer[];
}
