import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { FolderPermission } from 'src/storage/entities/folder-permission.entity';
import { Folder } from 'src/storage/entities/folder.entity';
import { Permission } from 'src/storage/entities/permission.entity';
import { User } from 'src/user/entities/user.entity';

export class FolderSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = await em.find(User, {});

    if (users.length === 0) {
      throw new Error('No users found. Run UserSeeder first.');
    }

    const defaultPermissions = await em.find(Permission, {
      $or: [{ name: 'READ' }, { name: 'WRITE' }],
    });

    for (const user of users) {
      const defaultFolder = new Folder('Files', user);
      em.persist(defaultFolder);

      await em.flush();

      const documents = new Folder('Documents', user, defaultFolder);
      const photos = new Folder('Photos', user, defaultFolder);

      em.persist(documents);
      em.persist(photos);

      const work = new Folder('Work', user, documents);
      const personal = new Folder('Personal', user, documents);

      em.persist(work);
      em.persist(personal);

      const folders = [defaultFolder, documents, photos, work, personal];

      for (const folder of folders) {
        this.setDefaultPermissions(defaultPermissions, user, folder, em);
      }
    }

    await em.flush();
  }

  private setDefaultPermissions(
    defaultPermissions: Permission[],
    user: User,
    folder: Folder,
    em: EntityManager,
  ): void {
    for (const permission of defaultPermissions) {
      const folderPermission = new FolderPermission(folder, user, permission);
      em.persist(folderPermission);
    }
  }
}
