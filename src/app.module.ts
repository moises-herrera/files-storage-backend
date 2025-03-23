import { Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import config from './config/mikro-orm.config';
import { UserModule } from './user/user.module';
import { StorageModule } from './storage/storage.module';
import { MikroORM } from '@mikro-orm/postgresql';

@Module({
  imports: [MikroOrmModule.forRoot(config), UserModule, StorageModule],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  async onModuleInit(): Promise<void> {
    await this.orm.getMigrator().up();
  }
}
