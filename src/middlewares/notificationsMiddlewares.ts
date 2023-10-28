import { Request, Response } from 'express';
import { notificationsService } from '../services';

export async function subscribe(req: Request<{ email: string }>, res: Response): Promise<void> {
  const email = req.params.email;

  try {
    await notificationsService.subscribe(email);
    res.send('Subscription request sent. Check your email to confirm');
  } catch (err) {
    res.status(500).send('Error subscribing email to SNS topic');
    console.log(err)
  }
}

export async function unsubscribe(req: Request<{ email: string }>, res: Response): Promise<void> {
  const email = req.params.email;

  try {
    await notificationsService.unsubscribe(email);
    res.send('Unsubscribed from SNS topic');
  } catch (err) {
    res.status(500).send('Error unsubscribing email from SNS topic');
    console.log(err)
  }
}
