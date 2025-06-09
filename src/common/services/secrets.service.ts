import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { EnvConfig } from 'src/config/env.config';

export class SecretsService {
  static async getSecretValue(secretName: string): Promise<EnvConfig> {
    const client = new SecretsManagerClient({
      region: 'us-east-1',
    });
    const command = new GetSecretValueCommand({
      SecretId: secretName,
    });

    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error(`Secret ${secretName} not found or is empty`);
    }

    return JSON.parse(response.SecretString) as EnvConfig;
  }
}
