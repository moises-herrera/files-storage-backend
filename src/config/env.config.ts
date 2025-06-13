import 'dotenv/config';
import { SecretsService } from 'src/common/services/secrets.service';
import { z } from 'zod';

export interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  FRONTEND_URL: string;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  AWS_REGION: string;
  BUCKET_NAME: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  MASTER_USER_SECRET_ARN?: string;
  AWS_SECRET_NAME?: string;
}

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().min(0).default(3000),
  FRONTEND_URL: z.string().min(1),
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.coerce.number().default(5432),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DB_NAME: z.string().default('files_storage'),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  AWS_REGION: z.string().default('us-east-1'),
  BUCKET_NAME: z.string().min(1),
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  MASTER_USER_SECRET_ARN: z.string().optional(),
  AWS_SECRET_NAME: z.string().optional(),
});

export default async (): Promise<EnvConfig> => {
  const secrets = await SecretsService.getSecretValue(
    process.env.AWS_SECRET_NAME || 'cloudnest-app-credentials',
  );
  const { data, error } = EnvSchema.safeParse({
    ...process.env,
    ...secrets,
  });

  if (error) {
    throw new Error(`Invalid secrets: ${error.message}`);
  }

  return data;
};
