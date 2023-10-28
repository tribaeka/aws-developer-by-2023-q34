import { SNS, SQS } from 'aws-sdk';
import { DEFAULT_REGION, SNS_TOPIC_ARN, SQS_URL } from '../config/aws.constants';
import { ImageMetadata } from '../types';


class NotificationsService {
  private sns: SNS;
  private sqs: SQS;

  constructor() {
    this.sns = new SNS({
      region: DEFAULT_REGION,
    })
    this.sqs = new SQS({
      region: DEFAULT_REGION,
    });
  }

  public async subscribe(email: string): Promise<void> {
    await this.sns.subscribe({
      Protocol: 'email',
      TopicArn: SNS_TOPIC_ARN,
      Endpoint: email,
    }).promise();
  }

  public async unsubscribe(email: string): Promise<void> {
    const { Subscriptions } = await this.sns.listSubscriptionsByTopic({
      TopicArn: SNS_TOPIC_ARN,
    }).promise();

    const subscription = Subscriptions?.find(subscription => subscription.Endpoint === email);

    if (!subscription) {
      throw new Error('Subscription not found')
    }

    await this.sns.unsubscribe({
      SubscriptionArn: <string>subscription.SubscriptionArn,
    })
  }

  public async addMessageToQueue(message: string): Promise<void> {
    await this.sqs.sendMessage({
      QueueUrl: SQS_URL,
      MessageBody: message,
    }).promise();
  }

  public async processSqsMessages(): Promise<void> {
    console.log(this.sqs)
    const receiveMessageResponse = await this.sqs.receiveMessage({
      QueueUrl: SQS_URL,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 10,
    }).promise();
    console.log(receiveMessageResponse);

    if (receiveMessageResponse?.Messages && receiveMessageResponse?.Messages?.length > 0) {
      for (const message of receiveMessageResponse?.Messages) {
        const imageMetadata: ImageMetadata = JSON.parse(message.Body || '');
        const snsMessage = `
        An image has been uploaded at ${new Date(imageMetadata.updatedAt).toDateString()}:
        Name: ${imageMetadata.name}
        Extension: ${imageMetadata.extension}
        Size: ${imageMetadata.size}
        Download link: ${imageMetadata.downloadUrl}
        `;

        await this.sns.publish({
          Subject: 'New image upload',
          Message: snsMessage,
          TopicArn: SNS_TOPIC_ARN,
        }).promise();
        await this.sqs.deleteMessage({
          QueueUrl: SQS_URL,
          ReceiptHandle: <string>message.ReceiptHandle,
        }).promise();
      }
    }
  }
}

export const notificationsService = new NotificationsService();

setInterval(() => notificationsService.processSqsMessages(), 60 * 1000);
