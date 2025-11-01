import { Expose, Transform } from 'class-transformer';
import { ProjectEntity } from '../project.entity';
import { buffersToBase64, bufferToBase64 } from '../../utils/image.utils';

export class ProjectResponseDto {
  @Expose()
  id: string;

  @Expose()
  type: string;

  @Expose()
  title: string;

  @Expose()
  startDate?: Date;

  @Expose()
  endDate?: Date;

  @Expose()
  description?: string;

  @Expose()
  context: string;

  @Expose()
  collaboration?: string;

  @Expose()
  missions: string[];

  @Expose()
  tools: string[];

  @Expose()
  skills: any[];

  @Expose()
  projectTypes: string[];

  @Expose()
  scope: string;

  @Expose()
  market: string;

  @Expose()
  challenges?: string;

  @Expose()
  impact?: string;

  @Expose()
  githubLink?: string;

  @Expose()
  @Transform(({ obj }) => buffersToBase64(obj.images))
  images: string[];

  @Expose()
  @Transform(({ obj }) => bufferToBase64(obj.image))
  image?: string;

  @Expose()
  createdAt: Date;

  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
