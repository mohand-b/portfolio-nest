import { Column, Entity, OneToMany } from 'typeorm';
import { TimelineItem } from '../timeline/timeline-item.entity';
import { CertificationEntity } from '../certification/certification.entity';

@Entity()
export class EducationEntity extends TimelineItem {
  @Column()
  institution: string;

  @Column()
  location: string;

  @Column({ nullable: true })
  fieldOfStudy?: string;

  @OneToMany(() => CertificationEntity, (cert) => cert.education, {
    cascade: true,
  })
  certifications?: CertificationEntity[];
}
