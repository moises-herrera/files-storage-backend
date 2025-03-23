import { EntityManager, EntityRepository, wrap } from '@mikro-orm/postgresql';
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CreateUserDto } from 'src/user/dtos/create-user.dto';
import { AuthService } from './auth.service';
import { LoginUserResponse } from 'src/user/interfaces/login-user-response.interface';
import { UserDto } from 'src/user/dtos/user.dto';
import { LoginUserDto } from 'src/user/dtos/login-user.dto';
import { FolderService } from 'src/storage/services/folder.service';
import { HasherService } from 'src/common/services/hasher.service';
import { UpdateUserDto } from '../dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly authService: AuthService,
    private readonly folderService: FolderService,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existsUser = await this.userRepository.count({ email: dto.email });

    if (existsUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = new User(dto.firstName, dto.lastName, dto.email, dto.password);
    await this.entityManager.persistAndFlush(user);
    await this.folderService.createFolder('default', user.id);

    return user;
  }

  async register(dto: CreateUserDto): Promise<LoginUserResponse> {
    const createdUser = await this.create(dto);
    return this.authenticateUser(createdUser);
  }

  async login({ email, password }: LoginUserDto): Promise<LoginUserResponse> {
    const user = await this.userRepository.findOne(
      {
        email,
      },
      {
        populate: ['password'],
      },
    );

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordValid = await user.verifyPassword(password);

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    return this.authenticateUser(user);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserDto> {
    if (
      Object.keys(dto).length === 0 ||
      Object.values(dto).every((value) => !value)
    ) {
      throw new BadRequestException('No data to update');
    }

    const user = await this.userRepository.findOneOrFail(id, {
      populate: ['password'],
    });

    Object.entries(dto).forEach(([key, value]) => {
      if (key in user && value) {
        user[key] = value as User[keyof User];
      }
    });

    await this.entityManager.persistAndFlush(user);

    return this.mapUserToDto(user);
  }

  private async authenticateUser(user: User): Promise<LoginUserResponse> {
    const { accessToken, refreshToken } = this.authService.generateTokens({
      userId: user.id,
    });

    const refreshTokenHash = await HasherService.hashPassword(refreshToken);
    wrap(user).assign({ refreshToken: refreshTokenHash });
    await this.entityManager.persistAndFlush(user);

    const response: LoginUserResponse = {
      user: this.mapUserToDto(user),
      accessToken,
      refreshToken,
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
