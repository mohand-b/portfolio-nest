import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from '../project/project.entity';

@Entity()
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  level: number;

  @Column()
  category: string;

  @ManyToMany(() => Project, (project) => project.skills)
  projects: Project[];
}
