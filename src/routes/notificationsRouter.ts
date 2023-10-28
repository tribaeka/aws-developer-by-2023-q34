import { Router } from 'express';
import { subscribe, unsubscribe } from '../middlewares/notificationsMiddlewares';

const router: Router = Router();

router.get('/subscribe/:email', subscribe);
router.get('/unsubscribe/:email', unsubscribe);



export const notificationsRouter = router;
