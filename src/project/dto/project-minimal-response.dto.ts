import { Expose } from 'class-transformer';

export class ProjectMinimalResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;
}
