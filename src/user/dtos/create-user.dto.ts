import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from 'src/user/validations/patterns';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  @Matches(EMAIL_PATTERN)
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @Matches(PASSWORD_PATTERN)
  readonly password: string;
}
