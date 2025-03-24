import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Folder } from './entities/folder.entity';
import { File } from './entities/file.entity';
import { Permission } from './entities/permission.entity';
import { FolderPermission } from './entities/folder-permission.entity';
import { FilePermission } from './entities/file-permission.entity';
import { FolderService } from './services/folder.service';
import { FolderController } from './controllers/folder.controller';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Permission, Folder, File, FolderPermission, FilePermission],
    }),
  ],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService],
})
export class StorageModule {}
