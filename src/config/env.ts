import 'dotenv/config';
import { z } from 'zod';

interface EnvConfig {
  PORT: number;
}

const EnvSchema = z.object({
  PORT: z.coerce.number().min(0).default(3000),
});

const { data, error } = EnvSchema.safeParse(process.env);

if (error) {
  throw new Error(`Invalid environment variables: ${error.message}`);
}

export const envConfig: EnvConfig = data;
