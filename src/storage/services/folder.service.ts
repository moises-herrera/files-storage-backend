import { InjectRepository } from '@mikro-orm/nestjs';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Folder } from 'src/storage/entities/folder.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/user/entities/user.entity';
import { Permission } from 'src/storage/entities/permission.entity';
import { FolderPermission } from 'src/storage/entities/folder-permission.entity';
import { FolderContentDto } from 'src/storage/dtos/folder-content.dto';
import { FolderDto } from 'src/storage/dtos/folder.dto';
import { FolderItemDto } from 'src/storage/dtos/folder-item.dto';
import { PaginatedResponseDto } from 'src/common/dtos/paginated-response.dto';
import { FileService } from './file.service';
import { GetOwnerFolderContentDto } from 'src/storage/dtos/get-folder-content.dto';
import { FolderRelatedDto } from '../dtos/folder-related.dto';
import { PaginationParamsDto } from 'src/common/dtos/pagination-params.dto';

@Injectable()
export class FolderService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Folder)
    private readonly folderRepository: EntityRepository<Folder>,
    @InjectRepository(Permission)
    private readonly permissionRepository: EntityRepository<Permission>,
    private readonly fileService: FileService,
  ) {}

  async create(
    folderName: string,
    ownerId: string,
    parentFolderId?: string,
  ): Promise<FolderDto> {
    const owner = this.entityManager.getReference(User, ownerId);
    let parentFolder: Folder | null;

    if (parentFolderId) {
      parentFolder = this.entityManager.getReference(Folder, parentFolderId);
    } else {
      parentFolder = await this.folderRepository.findOne({
        parentFolder: null,
        owner: ownerId,
      });
    }

    const folder = new Folder(folderName, owner, parentFolder as Folder);

    await this.setDefaultPermissions(folder, owner);

    await this.entityManager.persistAndFlush(folder);

    return this.mapFolderToDto(folder);
  }

  async getOwnerFolderItems({
    ownerId,
    folderId,
    search = '',
    page = 1,
    pageSize = 10,
  }: GetOwnerFolderContentDto): Promise<PaginatedResponseDto<FolderItemDto>> {
    const offset = (page - 1) * pageSize;
    const results: (FolderItemDto & {
      totalItems: string;
    })[] = await this.entityManager.getConnection().execute(
      `
        WITH combined_items AS (
          (
            SELECT 
              id,
              name,
              created_at AS "createdAt",
              updated_at AS "updatedAt",
              'folder' AS type,
              NULL::text AS extension,
              NULL::integer AS size,
              NULL::text AS "mimeType",
              owner_id AS owner,
              parent_folder_id AS folder
            FROM folder
            WHERE parent_folder_id = ? AND owner_id = ?
          )
          UNION ALL
          (
            SELECT 
              id,
              name,
              created_at AS "createdAt",
              updated_at AS "updatedAt",
              'file' AS type,
              extension,
              size,
              mime_type AS "mimeType",
              owner_id AS owner,
              folder_id AS folder
            FROM file
            WHERE folder_id = ? AND owner_id = ?
          )
        )
        SELECT 
          *,
          COUNT(*) OVER() AS "totalItems"
        FROM combined_items WHERE (? = '' OR name ILIKE ?)
        ORDER BY "updatedAt" DESC
        LIMIT ? OFFSET ?;
        `,
      [
        folderId,
        ownerId,
        folderId,
        ownerId,
        search,
        `${search}%`,
        pageSize,
        offset,
      ],
    );
    const totalItems = results.length ? parseInt(results[0].totalItems, 10) : 0;
    const totalPages = Math.ceil(totalItems / pageSize);

    const response: PaginatedResponseDto<FolderItemDto> = {
      data: results.map(
        ({
          id,
          name,
          type,
          extension,
          size,
          mimeType,
          owner,
          folder,
          createdAt,
          updatedAt,
        }) => {
          return {
            id,
            name,
            type,
            extension,
            size,
            mimeType,
            owner,
            folder,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
          };
        },
      ),
      pagination: {
        currentPage: page,
        pageSize,
        totalItems,
        totalPages,
      },
    };

    return response;
  }

  async getOwnerFolderContent({
    ownerId,
    folderId,
    search = '',
    page = 1,
    pageSize = 10,
  }: GetOwnerFolderContentDto): Promise<FolderContentDto> {
    if (folderId) {
      const folders: {
        id: string;
        name: string;
        parent_folder_id: string | null;
        owner_id: string;
      }[] = await this.entityManager.getConnection().execute(
        `
        WITH RECURSIVE parent_folders AS (
          SELECT id, name, parent_folder_id, owner_id
          FROM folder
          WHERE id = ? AND owner_id = ?
          UNION ALL
          SELECT f.id, f.name, f.parent_folder_id, f.owner_id
          FROM folder f
          INNER JOIN parent_folders pf ON f.id = pf.parent_folder_id
        )
        SELECT * FROM parent_folders;
      `,
        [folderId, ownerId],
      );

      if (!folders.length) {
        throw new NotFoundException(`Folder with id ${folderId} not found`);
      }

      const folderItems = await this.getOwnerFolderItems({
        folderId,
        ownerId,
        search,
        page,
        pageSize,
      });

      return {
        folders: folders.map((folder) => ({
          id: folder.id,
          name: folder.name,
          owner: folder.owner_id,
          parentFolder: folder.parent_folder_id,
        })),
        items: folderItems,
      };
    }

    const folder = await this.folderRepository.findOne({
      parentFolder: null,
      owner: ownerId,
    });

    if (!folder) {
      throw new NotFoundException('Root folder not found');
    }

    const folderItems = await this.getOwnerFolderItems({
      folderId: folder.id,
      ownerId,
      search,
      page,
      pageSize,
    });

    return {
      folders: [
        {
          id: folder.id,
          name: folder.name,
          owner: folder.owner.id,
          parentFolder: null,
        },
      ],
      items: folderItems,
    };
  }

  async getRecentFolders(
    userId: string,
    { page = 1, pageSize = 10 }: PaginationParamsDto,
  ): Promise<FolderRelatedDto[]> {
    const folders = await this.folderRepository.find(
      {
        parentFolder: {
          $ne: null,
        },
        $or: [{ owner: userId }, { permissions: { user: userId } }],
      },
      {
        fields: ['id', 'name', 'owner', 'parentFolder'],
        orderBy: { updatedAt: 'DESC' },
        limit: pageSize,
        offset: (page - 1) * pageSize,
      },
    );
    const foldersMapped = folders.map(({ id, name, owner, parentFolder }) => ({
      id,
      name,
      owner: owner.id,
      parentFolder: parentFolder?.id || null,
    }));

    return foldersMapped;
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
          await this.deleteFolderRecursively(em, folder.id, userId);
        }
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete folders from database',
        {
          cause: error,
        },
      );
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

  private async deleteFolderRecursively(
    em: EntityManager,
    folderId: string,
    userId: string,
  ): Promise<void> {
    const subfolders = await em.find(Folder, {
      parentFolder: folderId,
      owner: userId,
    });

    for (const subfolder of subfolders) {
      await this.deleteFolderRecursively(em, subfolder.id, userId);
    }

    await this.fileService.deleteManyByFolderId(userId, folderId);
    await em.nativeDelete(FolderPermission, { folder: folderId });
    await em.nativeDelete(Folder, { id: folderId, owner: userId });
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
