import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Folder } from 'src/storage/entities/folder.entity';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class FolderService {
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Folder)
    private readonly folderRepository: EntityRepository<Folder>,
  ) {}

  async createFolder(
    folderName: string,
    userId: string,
    parentFolderId?: string,
  ): Promise<Folder> {
    const owner = this.entityManager.getReference(User, userId);
    let parentFolder: Folder | undefined;

    if (parentFolderId) {
      parentFolder = this.entityManager.getReference(Folder, parentFolderId);
    }

    const folder = new Folder(folderName, owner, parentFolder);
    await this.entityManager.persistAndFlush(folder);

    return folder;
  }
}
