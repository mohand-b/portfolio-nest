import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateVisitorDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;
}
