import { Knex, knex } from 'knex';
import { IMAGES_TABLE_NAME, KNEX_CONFIG } from '../config/knex.constants';
import { Image } from '../types';
import { S3 } from 'aws-sdk';
import { DEFAULT_REGION, S3_IMAGE_PREFIX, S3_IMAGES_BUCKET_NAME } from '../config/aws.constants';
import { notificationsService } from './notificationsService';
import { Request } from 'express';

type CreateImageParams = {
  name: string;
  buffer: Buffer;
  contentType: string;
  size: number;
}

class ImagesService {
  private db: Knex<Image>;
  private s3: S3;

  constructor() {
    this.db = knex<Image>(KNEX_CONFIG);
    this.s3 = new S3({
      region: DEFAULT_REGION,
    });
  }

  public async init(): Promise<void> {
    const isTableExists = this.db.schema.hasTable(IMAGES_TABLE_NAME);

    if (!isTableExists) {
      await this.db.schema.createTable(IMAGES_TABLE_NAME, (table) => {
        table.increments('id').primary();
        table.string('name').unique().notNullable();
        table.string('extension').notNullable();
        table.string('filePath').notNullable();
        table.string('contentType').notNullable();
        table.integer('size').notNullable();
        table.timestamp('updatedAt').defaultTo(this.db.fn.now());
        table.timestamp('createdAt').defaultTo(this.db.fn.now());
      });
      console.log(`Table "${IMAGES_TABLE_NAME}" created.`);
    } else {
      console.log(`Table "${IMAGES_TABLE_NAME}" already exists.`);
    }
  }

  public async getImage(name: string): Promise<(Image & { buffer: Buffer }) | null> {
    const image = await this.db<Image>(IMAGES_TABLE_NAME).where({ name }).first();

    if (!image) {
      return null;
    }

    const buffer = await this.getImageBufferFromS3(image.filePath);

    return { ...image, buffer };
  }

  public async addImage(req: Request, { name, buffer, contentType, size }: CreateImageParams): Promise<number> {
    const filePath = `${S3_IMAGE_PREFIX}${name}`;
    const extension = name.split('.')[1];

    await this.saveImageToS3(buffer, contentType, filePath);

    const timestamp = new Date();
    const [image] = await this.db<Image>(IMAGES_TABLE_NAME).insert({
      name,
      extension,
      filePath,
      contentType,
      size,
      createdAt: timestamp,
      updatedAt: timestamp
    }, '*');

    const imageMetadata = {
      name,
      extension,
      size,
      updatedAt: timestamp,
      downloadUrl: `${req.protocol}://${req.hostname}/images/${name}/download`
    };

    await notificationsService.addMessageToQueue(JSON.stringify(imageMetadata))

    return image.id;
  }

  public async deleteImage(name: string): Promise<void> {
    const image = await this.getImage(name);

    if (!image) {
      return;
    }

    await this.deleteImageFromS3(image.filePath);
    await this.db<Image>(IMAGES_TABLE_NAME).where({ name }).delete();
  }

  public async getRandomImage(): Promise<Image | null | undefined> {
    const imagesCount = await this.db<Image>(IMAGES_TABLE_NAME).count('*', { as: 'count' });
    const totalImages = parseInt(imagesCount[0].count as string, 10);
    const randomOffset = Math.floor(Math.random() * totalImages);

    return this.db<Image>(IMAGES_TABLE_NAME).offset(randomOffset).limit(1).first();
  }

  private async saveImageToS3(buffer: Buffer, mimeType: string, filePath: string): Promise<S3.ManagedUpload.SendData> {
    const params = {
      Bucket: S3_IMAGES_BUCKET_NAME,
      Key: filePath,
      Body: buffer,
      ContentType: mimeType,
    };

    return this.s3.upload(params).promise();
  }

  private async deleteImageFromS3(filePath: string): Promise<S3.DeleteObjectOutput> {
    const params = {
      Bucket: S3_IMAGES_BUCKET_NAME,
      Key: filePath,
    };

    return this.s3.deleteObject(params).promise();
  }

  private async getImageBufferFromS3(filePath: string): Promise<Buffer> {
    const params = {
      Bucket: S3_IMAGES_BUCKET_NAME,
      Key: filePath,
    };
    const { Body } = await this.s3.getObject(params).promise();

    return Body as Buffer;
  }
}

export const imagesService = new ImagesService();
