import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  S3ServiceException,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { envConfig } from 'src/config/env.config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly client = new S3Client({
    region: envConfig.AWS_REGION,
    credentials: {
      accessKeyId: envConfig.AWS_ACCESS_KEY_ID,
      secretAccessKey: envConfig.AWS_SECRET_ACCESS_KEY,
    },
  });

  async getFileUrl(path: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: envConfig.BUCKET_NAME,
      Key: path,
    });

    try {
      const url = await getSignedUrl(this.client, command, {
        expiresIn: 3600,
      });
      return url;
    } catch (error) {
      throw new Error(
        `Error from S3 while generating signed URL for object in ${envConfig.BUCKET_NAME}. ${error}`,
        {
          cause: error,
        },
      );
    }
  }

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
        throw new Error(
          `Error from S3 while uploading object to ${envConfig.BUCKET_NAME}. \nThe object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \nor the multipart upload API (5TB max).`,
          {
            cause: caught,
          },
        );
      } else if (caught instanceof S3ServiceException) {
        throw new Error(
          `Error from S3 while uploading object to ${envConfig.BUCKET_NAME}. ${caught.name}: ${caught.message}`,
          {
            cause: caught,
          },
        );
      } else {
        throw new Error(
          `Error from S3 while uploading object to ${envConfig.BUCKET_NAME}. ${caught}`,
          {
            cause: caught,
          },
        );
      }
    }
  }

  async deleteFile(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: envConfig.BUCKET_NAME,
      Key: path,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      throw new Error(
        `Error from S3 while deleting object from ${envConfig.BUCKET_NAME}. ${error}`,
        {
          cause: error,
        },
      );
    }
  }
}
