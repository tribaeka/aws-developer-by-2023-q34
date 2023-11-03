import { S3 } from 'aws-sdk';
import db from './db';
import { Image } from '../types';
import { IMAGES_TABLE_NAME } from '../config/knex.constants';
import { S3_IMAGE_PREFIX, S3_IMAGES_BUCKET_NAME } from '../config/aws.constants';

const s3 = new S3();

export const handler = async () => {
  const images = await db.select<Image[]>('*').from(IMAGES_TABLE_NAME);
  console.log(images);
  const { Contents: s3ObjectsList} = await s3.listObjectsV2({
    Bucket: S3_IMAGES_BUCKET_NAME,
    Prefix: S3_IMAGE_PREFIX
  }).promise();

  if (!s3ObjectsList) {
    throw new Error('Empty s3 storage')
  }

  console.log(s3ObjectsList);

  return  images.every(image => s3ObjectsList.some(object => image.name === object.Key));
}
