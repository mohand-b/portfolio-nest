import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectEntity } from '../project/project.entity';

@Entity()
export class SkillEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'int' })
  level: number;

  @Column()
  category: string;

  @ManyToMany(() => ProjectEntity, (project) => project.skills)
  projects: ProjectEntity[];
}
