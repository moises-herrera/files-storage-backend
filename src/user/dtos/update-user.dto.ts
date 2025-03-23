import { IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { EMAIL_PATTERN, PASSWORD_PATTERN } from 'src/user/validations/patterns';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(EMAIL_PATTERN)
  readonly email?: string;

  @IsOptional()
  @IsString()
  @Matches(PASSWORD_PATTERN)
  readonly password?: string;
}
