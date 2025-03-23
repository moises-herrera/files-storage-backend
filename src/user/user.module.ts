import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/config/env.config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from 'src/user/services/auth.service';
import { UserService } from 'src/user/services/user.service';
import { JwtStrategy } from 'src/user/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { UserController } from './user.controller';
import { StorageModule } from 'src/storage/storage.module';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User] }),
    StorageModule,
    JwtModule.register({
      secret: envConfig.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [UserController],
  providers: [AuthService, UserService, JwtStrategy, JwtRefreshStrategy],
  exports: [],
})
export class UserModule {}
