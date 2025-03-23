import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { Response } from 'express';
import { envConfig } from 'src/config/env.config';
import { AuthTokens } from './interfaces/auth-tokens.interface';
import { AuthUserResponseDto } from './dtos/auth-user-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ExtendedRequest } from 'src/common/interfaces/extended-request.interface';
import { UserDto } from './dtos/user.dto';

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

  @Get('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response): void {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(HttpStatus.OK).json({
      message: 'Logged out successfully',
    });
  }

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  async updateUser(
    @Req() req: ExtendedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDto> {
    return this.userService.updateUser(req.user.id, updateUserDto);
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
