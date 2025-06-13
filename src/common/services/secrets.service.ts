import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { EnvConfig } from 'src/config/env.config';

export class SecretsService {
  static async getSecretValue(secretName: string): Promise<EnvConfig> {
    const client = new SecretsManagerClient({
      region: process.env.AWS_REGION || 'us-east-1',
    });
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });

    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error(`Secret ${secretName} not found or is empty`);
    }

    let config = JSON.parse(response.SecretString) as EnvConfig;

    if (!config.MASTER_USER_SECRET_ARN) return config;

    const masterUserCommand = new GetSecretValueCommand({
      SecretId: config.MASTER_USER_SECRET_ARN,
    });

    const masterUserResponse = await client.send(masterUserCommand);

    if (!masterUserResponse.SecretString) {
      throw new Error(
        `DB Master user secret ${config.MASTER_USER_SECRET_ARN} not found or is empty`,
      );
    }

    const dbPasswordData = JSON.parse(masterUserResponse.SecretString) as {
      password?: string;
    };

    if (!dbPasswordData.password) {
      throw new Error(
        `DB Master user secret ${config.MASTER_USER_SECRET_ARN} does not contain a password`,
      );
    }

    config = {
      ...config,
      DB_PASSWORD: dbPasswordData.password,
    };

    return config;
  }
}
