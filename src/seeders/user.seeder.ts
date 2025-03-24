import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { User } from 'src/user/entities/user.entity';

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const users = [
      {
        firstName: 'Test',
        lastName: 'User',
        email: 'user@example.com',
        password: 'Aa12345678',
      },
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'Aa12345678',
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'Aa12345678',
      },
    ];

    for (const userData of users) {
      const user = new User(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
      );
      em.persist(user);
    }

    await em.flush();
  }
}
