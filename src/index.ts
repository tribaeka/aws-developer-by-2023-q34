import express, { Request, Response } from 'express';
import { MetadataService } from 'aws-sdk';
import { imagesRouter, notificationsRouter } from './routes';
import { imagesService, notificationsService } from './services';

imagesService.init();

const app = express();

const infoMiddleware = async (req: Request, res: Response): Promise<void> => {
  const metadataService = new MetadataService();

  metadataService.request('/latest/meta-data/placement/availability-zone', (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(data);
    }
  })
}

app.get('/', infoMiddleware)

app.use('/images', imagesRouter)
app.use('/notifications', notificationsRouter)

app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})
