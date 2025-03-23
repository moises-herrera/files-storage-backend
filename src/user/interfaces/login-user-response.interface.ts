import { UserDto } from '../dtos/user.dto';

export interface LoginUserResponse {
  accessToken: string;
  refreshToken: string;
  user: UserDto;
}
