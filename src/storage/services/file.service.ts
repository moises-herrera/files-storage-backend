import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { File as FileEntity } from 'src/storage/entities/file.entity';
import { EntityManager, EntityRepository, wrap } from '@mikro-orm/postgresql';
import { User } from 'src/user/entities/user.entity';
import { Folder } from 'src/storage/entities/folder.entity';
import { Permission } from 'src/storage/entities/permission.entity';
import { FilePermission } from 'src/storage/entities/file-permission.entity';
import { FileDto } from 'src/storage/dtos/file.dto';
import { StorageService } from './storage.service';
import { v4 as uuid } from 'uuid';
import { FileUrlDto } from 'src/storage/dtos/file-url.dto';
import { UpdateFileDto } from 'src/storage/dtos/update-file.dto';
import { PaginationParamsDto } from 'src/common/dtos/pagination-params.dto';
import { FileInfoDto } from '../dtos/file-info.dto';

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

  private async saveFile(
    userId: string,
    file: Express.Multer.File,
    folderReference: Folder,
    entityManager: EntityManager,
  ) {
    const fileExtension = file.originalname.split('.').pop() || '';
    const existingFile = await this.fileRepository.findOne({
      name: file.originalname,
      folder: folderReference,
      extension: fileExtension,
    });

    const fileId = existingFile?.id ?? uuid();
    const storagePath = `users/${userId}/files/${fileId}`;

    try {
      await this.storageService.uploadFile(file, storagePath);
    } catch (error) {
      throw new BadRequestException('Failed to upload file to storage', {
        cause: error,
      });
    }

    try {
      if (!existingFile) {
        const userReference = entityManager.getReference(User, userId);

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
        await this.setDefaultPermissions(fileToCreate, userReference);
        await entityManager.persistAndFlush(fileToCreate);

        return this.mapFileToDto(fileToCreate);
      } else {
        wrap(existingFile).assign({
          extension: fileExtension,
          size: file.size,
          mimeType: file.mimetype,
          updatedAt: new Date(),
        });

        await entityManager.persistAndFlush(existingFile);
        return this.mapFileToDto(existingFile);
      }
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to save file to database',
        {
          cause: error,
        },
      );
    }
  }

  async getRecentFiles(
    userId: string,
    { page = 1, pageSize = 10 }: PaginationParamsDto,
  ): Promise<FileInfoDto[]> {
    const files = await this.fileRepository.find(
      {
        $or: [
          { owner: userId },
          {
            permissions: {
              user: userId,
              permission: { name: 'READ' },
            },
          },
        ],
      },
      {
        populate: ['owner', 'folder.name', 'permissions.permission'],
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    );

    const filesMapped: FileInfoDto[] = files.map(
      ({
        id,
        name,
        extension,
        size,
        mimeType,
        owner,
        folder,
        createdAt,
        updatedAt,
      }) => ({
        id,
        name,
        extension,
        size,
        mimeType,
        owner: {
          id: owner.id,
          firstName: owner.firstName,
          lastName: owner.lastName,
          email: owner.email,
        },
        folder: {
          id: folder.id,
          name: folder.name,
        },
        createdAt,
        updatedAt,
      }),
    );

    return filesMapped;
  }

  async upload(
    userId: string,
    files: Express.Multer.File[],
    folderId?: string,
  ): Promise<FileDto[]> {
    let folderReference: Folder | null;

    if (folderId) {
      folderReference = await this.entityManager.findOne(Folder, {
        id: folderId,
        $or: [{ permissions: { user: userId, permission: { name: 'WRITE' } } }],
      });
    } else {
      folderReference = await this.entityManager.findOne(Folder, {
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

    const response: FileDto[] = [];

    await this.entityManager.transactional(async (em) => {
      for (const file of files) {
        const savedFile = await this.saveFile(
          userId,
          file,
          folderReference,
          em,
        );
        response.push(savedFile);
      }
    });

    return response;
  }

  async update(
    userId: string,
    fileId: string,
    updateFileDto: UpdateFileDto,
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

    file.name = updateFileDto.name || file.name;

    if (updateFileDto.folderId) {
      const folder = await this.entityManager.findOne(Folder, {
        id: updateFileDto.folderId,
        $or: [
          { owner: userId },
          { permissions: { user: userId, permission: { name: 'WRITE' } } },
        ],
      });

      if (!folder) {
        throw new NotFoundException('Folder not found');
      }

      file.folder = folder;
    }

    try {
      await this.entityManager.persistAndFlush(file);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to update file in database',
        {
          cause: error,
        },
      );
    }

    return this.mapFileToDto(file);
  }

  async getUrl(userId: string, fileId: string): Promise<FileUrlDto> {
    const file = await this.fileRepository.findOne({
      id: fileId,
      $or: [
        { owner: userId },
        { permissions: { user: userId, permission: { name: 'READ' } } },
      ],
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    const url = await this.storageService.getFileUrl(file.storagePath);

    return { url };
  }

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

    await this.deleteFiles(files);
  }

  async deleteManyByFolderId(userId: string, folderId: string): Promise<void> {
    const files = await this.fileRepository.find({
      folder: folderId,
      $or: [
        { owner: userId },
        { permissions: { user: userId, permission: { name: 'WRITE' } } },
      ],
    });

    await this.deleteFiles(files);
  }

  private async deleteFiles(files: FileEntity[]): Promise<void> {
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
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    };
  }
}
