import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { Response } from 'express';
import { envConfig } from 'src/config/env.config';
import { AuthTokens } from './interfaces/auth-tokens.interface';
import { AuthUserResponseDto } from './dtos/auth-user-response.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Res({ passthrough: true }) res: Response,
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthUserResponseDto> {
    const { user, accessToken, refreshToken } =
      await this.userService.register(createUserDto);

    this.setAuthCookies(res, { accessToken, refreshToken });

    return { user };
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<AuthUserResponseDto> {
    const { user, accessToken, refreshToken } =
      await this.userService.login(loginUserDto);

    this.setAuthCookies(res, { accessToken, refreshToken });

    return { user };
  }

  private setAuthCookies(
    res: Response,
    { accessToken, refreshToken }: AuthTokens,
  ): void {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: envConfig.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 * 1000,
    });
  }
}
