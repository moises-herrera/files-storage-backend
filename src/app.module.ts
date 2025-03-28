import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './config/mikro-orm.config';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    MikroOrmModule.forRoot(config),
    UserModule,
    StorageModule,
  ],
})
export class AppModule {}
