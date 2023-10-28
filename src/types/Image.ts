export type Image = {
  id: number;
  name: string;
  extension: string;
  filePath: string;
  contentType: string;
  size: number,
  updatedAt: Date;
  createdAt: Date;
}

export type ImageMetadata = Pick<Image, 'name' | 'extension' | 'size' | 'updatedAt'> & {
  downloadUrl: string;
}
