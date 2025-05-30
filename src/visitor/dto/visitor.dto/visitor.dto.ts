import { IsEmail, IsNotEmpty } from 'class-validator';

export class VisitorDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
}
