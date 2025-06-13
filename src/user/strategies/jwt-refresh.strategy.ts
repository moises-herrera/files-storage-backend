import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HasherService } from 'src/common/services/hasher.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super({
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET') as string,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return (req.cookies as { refreshToken: string }).refreshToken;
        },
      ]),
      passReqToCallback: true,
    } as any);
  }

  async validate(req: Request, payload: { userId: string }): Promise<User> {
    const user = await this.userRepository.findOne(
      { id: payload.userId },
      {
        populate: ['refreshToken'],
      },
    );

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    const refreshToken = (req.cookies as { refreshToken: string })
      ?.refreshToken;

    const isValidRefreshToken = await HasherService.verifyPassword(
      user.refreshToken ?? '',
      refreshToken,
    );

    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
