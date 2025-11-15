import { Expose } from 'class-transformer';
import { CertificationTypeEnum } from '../../common/enums/certification-type.enum';

export class CertificationLightDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  certificationType: CertificationTypeEnum;
}
