import { IsNotEmpty, IsString } from 'class-validator';

export class RejectQuestionDto {
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}
