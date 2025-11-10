import { IsEnum, IsString } from 'class-validator';
import { CertificationTypeEnum } from '../../common/enums/certification-type.enum';

export class CreateCertificationDto {
  @IsString()
  title: string;

  @IsEnum(CertificationTypeEnum)
  certificationType: CertificationTypeEnum;

  @IsString()
  educationId: string;
}
