import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { PermissionsSeeder } from './permissions.seeder';
import { UserSeeder } from './user.seeder';
import { FolderSeeder } from './folder.seeder';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const seeders = [
      new PermissionsSeeder(),
      new UserSeeder(),
      new FolderSeeder(),
    ];

    for (const seeder of seeders) {
      await seeder.run(em);
    }
  }
}
