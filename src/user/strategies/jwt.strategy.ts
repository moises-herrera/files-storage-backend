/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from 'src/user/entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { envConfig } from 'src/config/env.config';
import { Request } from 'express';
import { TokenPayload } from 'src/user/interfaces/token-payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {
    super({
      secretOrKey: envConfig.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return (req.cookies as { accessToken: string }).accessToken;
        },
      ]),
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const userId = (payload as { userId: string }).userId;
    const email = (payload as { email: string }).email;
    const user = await this.userRepository.findOne({
      $or: [{ id: userId }, { email }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return user;
  }
}
