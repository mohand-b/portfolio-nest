import { Expose } from 'class-transformer';

export class SkillLightDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  category: string;
}
