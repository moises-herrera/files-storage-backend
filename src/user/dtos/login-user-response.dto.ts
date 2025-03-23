import { UserDto } from './user.dto';

export class LoginUserResponseDto {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
