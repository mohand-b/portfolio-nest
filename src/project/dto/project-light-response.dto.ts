import { Expose, Transform } from 'class-transformer';
import { ProjectEntity } from '../project.entity';

export class ProjectLightResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description?: string;

  @Expose()
  projectTypes: string[];

  @Expose()
  scope: string;

  @Expose()
  market: string;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.job) {
      return {
        id: obj.job.id,
        title: obj.job.title,
        company: obj.job.company,
      };
    }
    return null;
  })
  job?: {
    id: string;
    title: string;
    company: string;
  } | null;

  constructor(partial: Partial<ProjectEntity>) {
    Object.assign(this, partial);
  }
}
