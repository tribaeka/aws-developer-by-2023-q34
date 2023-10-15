import express, { Request, Response } from 'express';
import { MetadataService } from 'aws-sdk';
import { imagesRouter } from './routes';

const app = express();

const infoMiddleware = async (req: Request, res: Response): Promise<void> => {
  console.log('it works!')
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

app.listen(3000, () => {
  console.log('The application is listening on port 3000!');
})
