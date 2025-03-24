import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Folder } from 'src/storage/entities/folder.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/user/entities/user.entity';
import { Permission } from 'src/storage/entities/permission.entity';
import { FolderPermission } from 'src/storage/entities/folder-permission.entity';
import { FolderInfoDto } from 'src/storage/dtos/folder-info.dto';
import { File } from 'src/storage/entities/file.entity';
import { FolderDto } from 'src/storage/dtos/folder.dto';

@Injectable()
export class FolderService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Folder)
    private readonly folderRepository: EntityRepository<Folder>,
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
  ) {}

  async create(
    folderName: string,
    ownerId: string,
    parentFolderId?: string,
  ): Promise<FolderDto> {
    const owner = this.entityManager.getReference(User, ownerId);
    let parentFolder: Folder | undefined;

    if (parentFolderId) {
      parentFolder = this.entityManager.getReference(Folder, parentFolderId);
    }

    const folder = new Folder(folderName, owner, parentFolder);

    await this.setDefaultPermissions(folder, owner);

    await this.entityManager.persistAndFlush(folder);

    return this.mapFolderToDto(folder);
  }

  async getFolderContent(
    ownerId: string,
    folderId?: string,
  ): Promise<FolderInfoDto> {
    let folder: Folder | null = null;

    if (!folderId) {
      folder = await this.folderRepository.findOne(
        {
          parentFolder: null,
          owner: ownerId,
        },
        {
          populate: ['permissions.permission', 'files', 'subFolders'],
        },
      );

      if (!folder) {
        throw new NotFoundException(
          `Root folder not found for user ${ownerId}`,
        );
      }

      return folder as unknown as FolderInfoDto;
    }

    folder = await this.folderRepository.findOne(
      {
        id: folderId,
        owner: ownerId,
      },
      {
        populate: ['permissions.permission', 'files', 'subFolders'],
      },
    );

    if (!folder) {
      throw new NotFoundException(`Folder with id ${folderId} not found`);
    }

    return folder as unknown as FolderInfoDto;
  }

  async update(
    folderId: string,
    folderName: string,
    userId: string,
  ): Promise<FolderDto> {
    const folder = await this.folderRepository.findOne({
      id: folderId,
      $or: [
        { owner: userId },
        { permissions: { user: userId, permission: { name: 'WRITE' } } },
      ],
    });

    if (!folder) {
      throw new NotFoundException(`Folder with id ${folderId} not found`);
    }

    folder.name = folderName;

    await this.entityManager.persistAndFlush(folder);

    return this.mapFolderToDto(folder);
  }

  async deleteMany(userId: string, folderIds: string[]): Promise<void> {
    const folders = await this.folderRepository.find({
      id: { $in: folderIds },
      $or: [
        { owner: userId },
        { permissions: { user: userId, permission: { name: 'WRITE' } } },
      ],
    });

    if (!folders.length) {
      throw new NotFoundException('Folders not found');
    }

    try {
      await this.entityManager.transactional(async (em) => {
        for (const folder of folders) {
          await em.nativeDelete(FolderPermission, {
            folder: folder.id,
            user: userId,
          });
          await em.nativeDelete(File, { folder: folder.id });
          await em.nativeDelete(Folder, { parentFolder: folder.id });
          await em.nativeDelete(Folder, { owner: userId, id: folder.id });
        }
      });
    } catch (error) {
      throw new NotFoundException('Failed to delete folders from database', {
        cause: error,
      });
    }
  }

  private async setDefaultPermissions(
    folder: Folder,
    owner: User,
  ): Promise<void> {
    const defaultPermissions = await this.permissionRepository.find({
      $or: [{ name: 'READ' }, { name: 'WRITE' }],
    });

    for (const permission of defaultPermissions) {
      const folderPermission = new FolderPermission(folder, owner, permission);
      this.entityManager.persist(folderPermission);
      folder.permissions.add(folderPermission);
    }
  }

  private mapFolderToDto(folder: Folder): FolderDto {
    return {
      id: folder.id,
      name: folder.name,
      owner: folder.owner.id,
      parentFolder: folder.parentFolder?.id || null,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    };
  }
}
