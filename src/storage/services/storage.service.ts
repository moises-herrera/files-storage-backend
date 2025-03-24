import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  S3ServiceException,
} from '@aws-sdk/client-s3';
import { envConfig } from 'src/config/env.config';

@Injectable()
export class StorageService {
  private readonly client = new S3Client({
    region: envConfig.AWS_REGION,
    credentials: {
      accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
      secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
    },
  });

  async uploadFile(file: Express.Multer.File, path: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: envConfig.BUCKET_NAME,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    try {
      await this.client.send(command);
    } catch (caught) {
      if (
        caught instanceof S3ServiceException &&
        caught.name === 'EntityTooLarge'
      ) {
        console.error(
          `Error from S3 while uploading object to ${envConfig.BUCKET_NAME}. \nThe object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \nor the multipart upload API (5TB max).`,
        );
      } else if (caught instanceof S3ServiceException) {
        console.error(
          `Error from S3 while uploading object to ${envConfig.BUCKET_NAME}. ${caught.name}: ${caught.message}`,
        );
      } else {
        throw caught;
      }
    }
  }
}
