import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Folder } from 'src/storage/entities/folder.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/user/entities/user.entity';
import { Permission } from 'src/storage/entities/permission.entity';
import { FolderPermission } from 'src/storage/entities/folder-permission.entity';
import { FolderContentDto } from 'src/storage/dtos/folder-content.dto';
import { File } from 'src/storage/entities/file.entity';
import { FolderDto } from 'src/storage/dtos/folder.dto';
import { FolderItemDto } from 'src/storage/dtos/folder-item.dto';

@Injectable()
export class FolderService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Folder)
    private readonly folderRepository: EntityRepository<Folder>,
    @InjectRepository(File)
    private readonly fileRepository: EntityRepository<File>,
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
    page = 1,
    pageSize = 10,
  ): Promise<FolderContentDto> {
    const filter = folderId?.trim()
      ? { id: folderId, owner: ownerId }
      : { parentFolder: null, owner: ownerId };
    const folder = await this.folderRepository.findOne(filter, {
      populate: [
        'permissions.permission',
        'parentFolder',
        'parentFolder.parentFolder',
      ],
    });

    if (!folder) {
      throw new NotFoundException(`Folder with id ${folderId} not found`);
    }

    const offset = (page - 1) * pageSize;

    const [subFolders, subFoldersCount] =
      await this.folderRepository.findAndCount(
        { parentFolder: folder.id },
        {
          populate: ['permissions.permission'],
          limit: pageSize,
          offset: offset,
        },
      );

    const [files, filesCount] = await this.fileRepository.findAndCount(
      { folder: folder.id },
      {
        populate: ['permissions.permission'],
        limit: pageSize,
        offset: offset,
      },
    );

    const items: FolderItemDto[] = [
      ...subFolders.map((folder) => ({
        id: folder.id,
        name: folder.name,
        type: 'folder',
        owner: folder.owner.id,
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        permissions: folder.permissions.map((permission) => ({
          id: permission.id,
          user: permission.user.id,
          permission: permission.permission.name,
        })),
      })),
      ...files.map((file) => ({
        ...file,
        type: 'file',
        owner: file.owner.id,
        folder: file.folder.id,
        permissions: file.permissions.map((permission) => ({
          id: permission.id,
          user: permission.user.id,
          permission: permission.permission.name,
        })),
      })),
    ].sort((a, b) => a.name.localeCompare(b.name)) as FolderItemDto[];

    return {
      folder: {
        ...folder,
        owner: folder.owner.id,
        parentFolder: folder.parentFolder || null,
        permissions: folder.permissions.map((permission) => ({
          id: permission.id,
          user: permission.user.id,
          permission: permission.permission.name,
        })),
      },
      items: {
        data: items,
        pagination: {
          currentPage: page,
          pageSize,
          totalItems: subFoldersCount + filesCount,
          totalPages: Math.ceil((subFoldersCount + filesCount) / pageSize),
        },
      },
    };
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
