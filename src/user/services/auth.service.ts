import { Injectable } from '@nestjs/common';
import { TokenPayload } from 'src/user/interfaces/token-payload.type';
import { AuthTokens } from 'src/user/interfaces/auth-tokens.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  generateTokens(tokenPayload: TokenPayload): AuthTokens {
    const accessToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: '1h',
    });
    const refreshToken = this.jwtService.sign(tokenPayload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
