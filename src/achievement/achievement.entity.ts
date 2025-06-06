import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VisitorEntity } from '../visitor/visitor.entity';

@Entity()
export class AchievementEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => VisitorEntity, (visitor) => visitor.achievements)
  visitors: VisitorEntity[];
}
