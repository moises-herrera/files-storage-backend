import { Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './config/mikro-orm.config';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { MikroORM, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { AppConfigModule } from './config/app-config.module';
import { ConfigService } from '@nestjs/config';
import { HealthModule } from './health/health.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';
import { EnvConfig } from './config/env.config';

@Module({
  imports: [
    AppConfigModule,
    MikroOrmModule.forRootAsync({
      useFactory: (configService: ConfigService<EnvConfig, true>) => {
        return {
          ...config,
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<string>('DB_PORT')),
          user: configService.get<string>('DB_USER'),
          password: configService.get<string>('DB_PASSWORD'),
          dbName: configService.get<string>('DB_NAME'),
        };
      },
      inject: [ConfigService],
      driver: PostgreSqlDriver,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    HealthModule,
    UserModule,
    StorageModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
    await this.orm.getSchemaGenerator().updateSchema();
  }
}
