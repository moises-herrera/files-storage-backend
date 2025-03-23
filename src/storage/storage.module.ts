import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Folder } from './entities/folder.entity';
import { File } from './entities/file.entity';
import { Permission } from './entities/permission.entity';
import { FolderPermission } from './entities/folder-permission.entity';
import { FilePermission } from './entities/file-permission.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MikroOrmModule.forFeature({
      entities: [Permission, Folder, File, FolderPermission, FilePermission],
    }),
  ],
})
export class StorageModule {}
