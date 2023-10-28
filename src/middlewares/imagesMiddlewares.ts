import { Request, Response } from 'express';
import { imagesService } from '../services';

export async function downloadImageHandler(req: Request<{ name: string }>, res: Response): Promise<void> {
  const image = await imagesService.getImage(req.params.name);

  if (image) {
    res.setHeader('Content-Type', image.contentType);
    res.send(image.buffer);
  } else {
    res.status(404).send('Image not found');
  }
}

export async function uploadImageHandler(req: Request, res: Response): Promise<void> {
  if (req.file !== undefined) {
    const { originalname: name, buffer, mimetype: contentType, size } = req.file;
    const id = await imagesService.addImage(req, { name, buffer, contentType, size });

    res.status(201).json({ id });
  } else {
    res.status(400).send('Request does not contain a file')

  }
}

export async function deleteImageHandler(req: Request<{ name: string }>, res: Response): Promise<void> {
  await imagesService.deleteImage(req.params.name);
  res.status(204).send();
}

export async function imageMetadataHandler(req: Request<{ name: string }>, res: Response): Promise<void> {
  const image = await imagesService.getImage(req.params.name);

  if (image) {
    const { name, extension, size , updatedAt } = image;

    res.json({ name, extension, size, updatedAt });
  } else {
    res.status(404).send('Image not found');
  }
}

export async function randomImageMetadataHandler(req: Request, res: Response): Promise<void> {
  const image = await imagesService.getRandomImage();

  if (image) {
    const { name, extension, size, updatedAt } = image;

    res.json({ name, extension, size, updatedAt });
  } else {
    res.status(404).send('No images available');
  }
}
