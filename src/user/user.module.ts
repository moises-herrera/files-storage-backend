import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/user/services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { JwtStrategy } from 'src/user/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserController } from './user.controller';
import { StorageModule } from 'src/storage/storage.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User] }),
    StorageModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserController],
  providers: [AuthService, UserService, JwtStrategy, JwtRefreshStrategy],
  exports: [],
})
export class UserModule {}
