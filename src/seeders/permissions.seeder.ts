import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Permission } from 'src/storage/entities/permission.entity';

export class PermissionsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const permissions = [
      {
        name: 'READ',
        description: 'Permission to read/view the item contents',
      },
      { name: 'WRITE', description: 'Permission to modify item contents' },
    ];

    for (const permission of permissions) {
      const permissionEntity = new Permission(
        permission.name,
        permission.description,
      );
      em.persist(permissionEntity);
    }

    await em.flush();
  }
}
