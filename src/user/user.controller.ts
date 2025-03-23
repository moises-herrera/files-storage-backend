import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './services/user.service';
import { LoginUserResponseDto } from './dtos/login-user-response.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<LoginUserResponseDto> {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
    return this.userService.login(loginUserDto);
  }
}
