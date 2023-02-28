import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class LoginUserDto {
  @IsString()
  @IsOptional()
  readonly username?: string;

  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsNotEmpty()
  @Length(6, 15)
  readonly password: string;
}
