import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { VisitorEntity } from '../visitor/visitor.entity';
import { QuestionStatusEnum } from '../common/enums/question-status.enum';

@Entity('questions')
export class QuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @ManyToOne(() => VisitorEntity, { nullable: true })
  @JoinColumn()
  visitor: VisitorEntity | null;

  @Column({
    type: 'enum',
    enum: QuestionStatusEnum,
    default: QuestionStatusEnum.PENDING,
  })
  status: QuestionStatusEnum;

  @Column({ type: 'text', nullable: true })
  answer: string | null;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
