import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { File as FileEntity } from 'src/storage/entities/file.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/user/entities/user.entity';
import { Folder } from 'src/storage/entities/folder.entity';
import { Permission } from 'src/storage/entities/permission.entity';
import { FilePermission } from 'src/storage/entities/file-permission.entity';
import { FileDto } from 'src/storage/dtos/file.dto';
import { StorageService } from './storage.service';

@Injectable()
export class FileService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(FileEntity)
    private readonly fileRepository: EntityRepository<FileEntity>,
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
    private readonly storageService: StorageService,
  ) {}

  async upload(
    file: Express.Multer.File,
    userId: string,
    folderId?: string,
  ): Promise<FileDto> {
    let folderReference: Folder | undefined;

    if (folderId) {
      folderReference = this.entityManager.getReference(Folder, folderId);
    } else {
      folderReference = await this.entityManager.findOneOrFail(Folder, {
        parentFolder: null,
        owner: userId,
      });
    }

    if (!folderReference) {
      throw new BadRequestException(
        folderId
          ? `Folder with ID ${folderId} not found`
          : `Root folder not found for user ${userId}`,
      );
    }

    const fileExtension = file.originalname.split('.').pop() || '';
    const userReference = this.entityManager.getReference(User, userId);
    const storagePath = `users/${userId}/files/${file.originalname}`;

    try {
      await this.storageService.uploadFile(file, storagePath);
    } catch (error) {
      throw new BadRequestException('Failed to upload file to storage', {
        cause: error,
      });
    }

    const fileToCreate = new FileEntity(
      file.originalname,
      fileExtension,
      file.size,
      file.mimetype,
      storagePath,
      userReference,
      folderReference,
    );

    try {
      await this.setDefaultPermissions(fileToCreate, userReference);
      await this.entityManager.persistAndFlush(fileToCreate);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save file to database',
        {
          cause: error,
        },
      );
    }

    return this.mapFileToDto(fileToCreate);
  }

  async rename(fileId: string, newName: string, userId: string) {}

  async getUrl(fileId: string) {}

  async delete(fileId: string) {}

  private async setDefaultPermissions(
    file: FileEntity,
    owner: User,
  ): Promise<void> {
    const defaultPermissions = await this.permissionRepository.find({
      $or: [{ name: 'READ' }, { name: 'WRITE' }],
    });

    for (const permission of defaultPermissions) {
      const filePermission = new FilePermission(file, owner, permission);
      this.entityManager.persist(filePermission);
      file.permissions.add(filePermission);
    }
  }

  private mapFileToDto(file: FileEntity): FileDto {
    return {
      id: file.id,
      name: file.name,
      extension: file.extension,
      size: file.size,
      mimeType: file.mimeType,
      storagePath: file.storagePath,
      owner: file.owner.id,
      folder: file.folder.id,
    };
  }
}
