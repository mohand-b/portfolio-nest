import { IsInt, IsString, Max, Min } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsInt()
  @Min(1)
  @Max(5)
  level: number;

  @IsString()
  category: string;
}
