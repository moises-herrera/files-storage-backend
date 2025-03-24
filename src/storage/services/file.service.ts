import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { v4 as uuid } from 'uuid';

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
    userId: string,
    file: Express.Multer.File,
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

    const fileId = uuid();
    const storagePath = `users/${userId}/files/${fileId}`;

    try {
      await this.storageService.uploadFile(file, storagePath);
    } catch (error) {
      throw new BadRequestException('Failed to upload file to storage', {
        cause: error,
      });
    }

    const fileExtension = file.originalname.split('.').pop() || '';
    const userReference = this.entityManager.getReference(User, userId);

    const fileToCreate = new FileEntity(
      fileId,
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

  async rename(
    userId: string,
    fileId: string,
    newName: string,
  ): Promise<FileDto> {
    const file = await this.fileRepository.findOne(
      {
        id: fileId,
        $or: [
          { owner: userId },
          { permissions: { user: userId, permission: { name: 'WRITE' } } },
        ],
      },
      {
        populate: ['permissions.permission'],
      },
    );

    if (!file) {
      throw new NotFoundException('File not found');
    }

    file.name = newName;

    try {
      await this.entityManager.persistAndFlush(file);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to rename file in database',
        {
          cause: error,
        },
      );
    }

    return this.mapFileToDto(file);
  }

  async getUrl(fileId: string) {}

  async deleteMany(userId: string, fileIds: string[]): Promise<void> {
    const files = await this.fileRepository.find({
      id: {
        $in: fileIds,
      },
      $or: [
        { owner: userId },
        { permissions: { user: userId, permission: { name: 'WRITE' } } },
      ],
    });

    if (!files.length) {
      throw new NotFoundException('Files not found');
    }

    try {
      await this.entityManager.transactional(async (em) => {
        for (const file of files) {
          await this.storageService.deleteFile(file.storagePath);
          await em.nativeDelete(FilePermission, {
            file: file.id,
          });
          await em.removeAndFlush(file);
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete files from storage',
        {
          cause: error,
        },
      );
    }
  }

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
