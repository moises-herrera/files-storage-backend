import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserResponseDto } from 'src/user/dtos/login-user-response.dto';
import { UserDto } from 'src/user/dtos/user.dto';
import { HasherService } from 'src/common/services/hasher.service';

@Injectable()
export class UserService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly authService: AuthService,
  ) {}

  async create(dto: CreateUserDto): Promise<UserDto> {
    const existsUser = await this.userRepository.count({ email: dto.email });

    if (existsUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = new User(dto.firstName, dto.lastName, dto.email, dto.password);
    await this.entityManager.persistAndFlush(user);

    const userDto = this.mapUserToDto(user);

    return userDto;
  }

  async login(email: string, password: string): Promise<LoginUserResponseDto> {
    const hashedPassword = await HasherService.hashPassword(password);
    const user = await this.userRepository.findOne({
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const { accessToken, refreshToken } = this.authService.generateTokens({
      userId: user.id,
    });

    const response: LoginUserResponseDto = {
      accessToken,
      refreshToken,
      user: this.mapUserToDto(user),
    };

    return response;
  }

  private mapUserToDto(user: User): UserDto {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
