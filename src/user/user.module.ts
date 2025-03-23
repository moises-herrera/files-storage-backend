import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { envConfig } from 'src/config/env.config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MikroOrmModule.forFeature({ entities: [User] }),
    JwtModule.register({
      secret: envConfig.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class UserModule {}
