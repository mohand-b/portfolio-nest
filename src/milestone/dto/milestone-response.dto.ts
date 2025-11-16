import { Expose } from 'class-transformer';

export class MilestoneResponseDto {
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
  image?: string;
}
