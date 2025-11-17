import { Expose, Type } from 'class-transformer';

class VisitorLightDto {
  @Expose()
  id: string;

  @Expose()
  username: string;
}

export class QuestionPublicResponseDto {
  @Expose()
  id: string;

  @Expose()
  content: string;

  @Expose()
  isAnonymous: boolean;

  @Expose()
  @Type(() => VisitorLightDto)
  visitor: VisitorLightDto | null;

  @Expose()
  answer: string;

  @Expose()
  createdAt: Date;
}
