import express, { Request, Response } from 'express';
import { MetadataService } from 'aws-sdk';
import { promisify } from 'util';

const app = express();

const infoMiddleware = async (req: Request, res: Response): Promise<void> => {
    const metadataService = new MetadataService();
    const requestPromise = promisify(metadataService.request);

    try {
        const data =  await requestPromise('/latest/meta-data/placement/availability-zone');
        console.log(data);

        res.send(data);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
}

app.get('/', infoMiddleware)

app.listen(3000, () => {
    console.log('The application is listening on port 3000!');
})
