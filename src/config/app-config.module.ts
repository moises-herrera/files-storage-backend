import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import getEnvConfig from './env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [getEnvConfig],
      isGlobal: true,
    }),
  ],
  exports: [ConfigModule],
})
export class AppConfigModule {}
