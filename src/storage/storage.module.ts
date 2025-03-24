import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Folder } from './entities/folder.entity';
import { File } from './entities/file.entity';
import { Permission } from './entities/permission.entity';
import { FolderPermission } from './entities/folder-permission.entity';
import { FilePermission } from './entities/file-permission.entity';
import { FolderService } from './services/folder.service';
import { FolderController } from './controllers/folder.controller';
import { FileService } from './services/file.service';
import { FileController } from './controllers/file.controller';
import { StorageService } from './services/storage.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Permission, Folder, File, FolderPermission, FilePermission],
    }),
  ],
  controllers: [FolderController, FileController],
  providers: [StorageService, FolderService, FileService],
  exports: [FolderService],
})
export class StorageModule {}
