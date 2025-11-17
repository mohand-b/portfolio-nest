import { Expose, Type } from 'class-transformer';
import { QuestionStatusEnum } from '../../common/enums/question-status.enum';

class VisitorLightDto {
  @Expose()
  id: string;

  @Expose()
  username: string;
}

export class QuestionResponseDto {
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
  status: QuestionStatusEnum;

  @Expose()
  answer: string | null;

  @Expose()
  rejectionReason: string | null;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
