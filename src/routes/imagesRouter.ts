import { Router } from 'express';
import {
  dataConsistency,
  deleteImageHandler,
  downloadImageHandler,
  imageMetadataHandler, randomImageMetadataHandler,
  uploadImageHandler
} from '../middlewares/imagesMiddlewares';
import multer from 'multer';

const router: Router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/data-consistency', dataConsistency);
router.get('/random/metadata', randomImageMetadataHandler);

router.get('/:name/download', downloadImageHandler);
router.get('/:name/metadata', imageMetadataHandler);

router.post('/', upload.single('image'), uploadImageHandler);
router.delete('/:name', deleteImageHandler);


export const imagesRouter = router;
