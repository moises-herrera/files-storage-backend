import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  S3ServiceException,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StorageService {
  private client: S3Client;
  private bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.get<string>('AWS_REGION') as string,
      credentials: {
        accessKeyId: this.configService.get<string>(
          'AWS_ACCESS_KEY_ID',
        ) as string,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      },
    });

    this.bucketName = this.configService.get<string>('BUCKET_NAME') as string;
  }

  async getFileUrl(path: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    try {
      const url = await getSignedUrl(this.client, command, {
        expiresIn: 3600,
      });
      return url;
    } catch (error) {
      throw new Error(
        `Error from S3 while generating signed URL for object in ${this.bucketName}. ${error}`,
        {
          cause: error,
        },
      );
    }
  }

  async uploadFile(file: Express.Multer.File, path: string): Promise<void> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
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
          `Error from S3 while uploading object to ${this.bucketName}. \nThe object was too large. To upload objects larger than 5GB, use the S3 console (160GB max) \nor the multipart upload API (5TB max).`,
          {
            cause: caught,
          },
        );
      } else if (caught instanceof S3ServiceException) {
        throw new Error(
          `Error from S3 while uploading object to ${this.bucketName}. ${caught.name}: ${caught.message}`,
          {
            cause: caught,
          },
        );
      } else {
        throw new Error(
          `Error from S3 while uploading object to ${this.bucketName}. ${caught}`,
          {
            cause: caught,
          },
        );
      }
    }
  }

  async deleteFile(path: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: path,
    });

    try {
      await this.client.send(command);
    } catch (error) {
      throw new Error(
        `Error from S3 while deleting object from ${this.bucketName}. ${error}`,
        {
          cause: error,
        },
      );
    }
  }
}
