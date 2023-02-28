import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly username: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @Matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/, {
    message:
      'The password should contain at least one digit, one uppercase and one lowercase letter. The password must be between 6 and 20 characters',
  })
  @IsNotEmpty()
  @Length(6, 15)
  readonly password: string;
}
