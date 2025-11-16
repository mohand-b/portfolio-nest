import { Expose } from 'class-transformer';

export class JobResponseDto {
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
  createdAt: Date;

  @Expose()
  company: string;

  @Expose()
  location: string;

  @Expose()
  missions: string[];

  @Expose()
  image?: string;
}
