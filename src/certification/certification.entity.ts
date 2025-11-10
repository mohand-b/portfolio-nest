import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EducationEntity } from '../education/education.entity';
import { CertificationTypeEnum } from '../common/enums/certification-type.enum';

@Entity()
export class CertificationEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: CertificationTypeEnum,
  })
  certificationType: CertificationTypeEnum;

  @ManyToOne(() => EducationEntity, (education) => education.certifications, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  education: EducationEntity;
}
