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
}

export const notificationsService = new NotificationsService();
