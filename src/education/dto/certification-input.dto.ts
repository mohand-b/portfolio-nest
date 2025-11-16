import { IsEnum, IsString } from 'class-validator';
import { CertificationTypeEnum } from '../../common/enums/certification-type.enum';

export class CertificationInputDto {
  @IsString()
  title: string;

  @IsEnum(CertificationTypeEnum)
  certificationType: CertificationTypeEnum;
}
