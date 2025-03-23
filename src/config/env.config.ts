import 'dotenv/config';
import { z } from 'zod';

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
}

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().min(0).default(3000),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('files_storage'),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
});

const { data, error } = EnvSchema.safeParse(process.env);

if (error) {
  throw new Error(`Invalid environment variables: ${error.message}`);
}

export const envConfig: EnvConfig = data;
