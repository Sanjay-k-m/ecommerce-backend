/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import * as fs from 'fs';
import * as path from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import multer, { diskStorage } from 'multer';
import sharp from 'sharp';

@Injectable()
export class StorageProviderService {
  private driver!: 'local' | 's3';
  private s3!: S3Client;
  private localPath!: string;
  private bucket!: string;

  private readonly allowedImageMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];
  private readonly allowedVideoMimeTypes = ['video/mp4', 'video/webm'];

  private readonly maxImageSize: number;
  private readonly maxVideoSize: number;

  constructor(private config: ConfigService) {
    this.driver = this.config.get<'local' | 's3'>('storage.driver') ?? 'local';

    this.maxImageSize =
      this.config.get<number>('storage.multer.image.maxFileSize') ??
      5 * 1024 * 1024;
    this.maxVideoSize =
      this.config.get<number>('storage.multer.video.maxFileSize') ??
      200 * 1024 * 1024;

    if (this.driver === 's3') {
      this.bucket = this.config.getOrThrow<string>('storage.s3.bucket');
      this.s3 = new S3Client({
        region: this.config.getOrThrow<string>('storage.s3.region'),
        credentials: {
          accessKeyId: this.config.getOrThrow<string>('storage.s3.accessKeyId'),
          secretAccessKey: this.config.getOrThrow<string>(
            'storage.s3.secretAccessKey',
          ),
        },
      });
    } else {
      this.localPath = this.config.getOrThrow<string>('storage.local.path');
      if (!fs.existsSync(this.localPath)) {
        fs.mkdirSync(this.localPath, { recursive: true });
      }
    }
  }

  /**
   * Upload single file with WebP conversion for images
   */
  async upload(file: Express.Multer.File, folder = ''): Promise<string> {
    if (!file) throw new InternalServerErrorException('File not provided');

    let buffer = file.buffer;
    let mimetype = file.mimetype;
    let originalname = file.originalname;

    // Convert images (jpeg/png) to WebP
    if (
      this.allowedImageMimeTypes.includes(file.mimetype) &&
      file.mimetype !== 'image/webp'
    ) {
      buffer = await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
      mimetype = 'image/webp';
      originalname = file.originalname.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }

    // Validate file type and size
    if (
      this.allowedImageMimeTypes.includes(mimetype) &&
      buffer.length > this.maxImageSize
    ) {
      throw new InternalServerErrorException(
        `Image exceeds max size of ${this.maxImageSize} bytes`,
      );
    }
    if (
      this.allowedVideoMimeTypes.includes(mimetype) &&
      buffer.length > this.maxVideoSize
    ) {
      throw new InternalServerErrorException(
        `Video exceeds max size of ${this.maxVideoSize} bytes`,
      );
    }

    if (this.driver === 's3') {
      const key = `${folder}/${Date.now()}-${originalname}`;
      try {
        const command = new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: mimetype,
        });
        await this.s3.send(command);

        return `https://${this.bucket}.s3.${this.config.get<string>(
          'storage.s3.region',
        )}.amazonaws.com/${key}`;
      } catch {
        throw new InternalServerErrorException('S3 upload failed');
      }
    } else {
      const filename = `${Date.now()}-${originalname}`;
      const filePath = path.join(this.localPath, folder, filename);
      fs.mkdirSync(path.join(this.localPath, folder), { recursive: true });
      fs.writeFileSync(filePath, buffer);
      return `/uploads/${folder}/${filename}`;
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMany(
    files: Express.Multer.File[],
    folder = '',
  ): Promise<string[]> {
    const results: string[] = [];
    for (const file of files) {
      results.push(await this.upload(file, folder));
    }
    return results;
  }

  /**
   * Delete file
   */
  async delete(key: string): Promise<void> {
    if (!key)
      throw new InternalServerErrorException('Invalid file key provided');

    if (this.driver === 's3') {
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      });
      await this.s3.send(command);
    } else {
      const filePath = path.join(this.localPath, key);
      if (!fs.existsSync(filePath))
        throw new InternalServerErrorException(`File not found: ${filePath}`);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory())
        throw new InternalServerErrorException(
          `Cannot delete directory: ${filePath}`,
        );
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Provide Multer config (use in controllers)
   */
  getMulterConfig(): MulterOptions {
    const limits = {
      fileSize: Math.max(this.maxImageSize, this.maxVideoSize),
    };

    if (this.driver === 's3') {
      return {
        storage: multer.memoryStorage(),
        limits,
        fileFilter: (_req, file, cb) => {
          if (
            this.allowedImageMimeTypes.includes(file.mimetype) ||
            this.allowedVideoMimeTypes.includes(file.mimetype)
          ) {
            cb(null, true);
          } else {
            cb(new InternalServerErrorException('Invalid file type'), false);
          }
        },
      };
    }

    return {
      storage: diskStorage({
        destination: this.localPath,
        filename: (_req, file, cb) => {
          cb(null, `${Date.now()}-${file.originalname}`);
        },
      }),
      limits,
      fileFilter: (_req, file, cb) => {
        if (
          this.allowedImageMimeTypes.includes(file.mimetype) ||
          this.allowedVideoMimeTypes.includes(file.mimetype)
        ) {
          cb(null, true);
        } else {
          cb(new InternalServerErrorException('Invalid file type'), false);
        }
      },
    };
  }
}
