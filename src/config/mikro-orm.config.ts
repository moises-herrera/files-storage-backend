import { defineConfig } from '@mikro-orm/postgresql';
import { envConfig } from './env.config';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  host: envConfig.DB_HOST,
  port: envConfig.DB_PORT,
  user: envConfig.DB_USER,
  password: envConfig.DB_PASSWORD,
  dbName: envConfig.DB_NAME,
  entities: ['./dist/**/*.entity.js'],
  entitiesTs: ['./src/**/*.entity.ts'],
  debug: envConfig.NODE_ENV !== 'production',
  extensions: [SeedManager, Migrator],
});
