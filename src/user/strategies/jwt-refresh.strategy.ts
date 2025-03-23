import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { HasherService } from 'src/common/services/hasher.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    super({
      secretOrKey: process.env.JWT_REFRESH_SECRET,
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
      refreshToken,
      user.refreshToken ?? '',
    );

    if (!isValidRefreshToken) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
