import { SNS } from 'aws-sdk';
import { DEFAULT_REGION, SNS_TOPIC_ARN } from '../config/aws.constants';
import { knex, Knex } from 'knex';
import { Notification } from '../types';
import { KNEX_CONFIG, NOTIFICATIONS_TABLE_NAME } from '../config/knex.constants';
class NotificationsService {
  private db: Knex<Notification>;
  private sns: SNS;

  constructor() {
    this.db = knex<Notification>(KNEX_CONFIG);
    this.sns = new SNS({
      region: DEFAULT_REGION,
    })
  }

  public async init(): Promise<void> {
    const isTableExists = this.db.schema.hasTable(NOTIFICATIONS_TABLE_NAME);

    if (!isTableExists) {
      await this.db.schema.createTable(NOTIFICATIONS_TABLE_NAME, (table) => {
        table.increments('id').primary();
        table.string('email').notNullable();
        table.string('subscriptionArn').unique().notNullable();
      });
      console.log(`Table "${NOTIFICATIONS_TABLE_NAME}" created.`);
    } else {
      console.log(`Table "${NOTIFICATIONS_TABLE_NAME}" already exists.`);
    }
  }

  public async subscribe(email: string): Promise<void> {
    const { SubscriptionArn } = await this.sns.subscribe({
      Protocol: 'email',
      TopicArn: SNS_TOPIC_ARN,
      Endpoint: email,
    }).promise();

    console.log(SubscriptionArn);

    await this.db<Notification>(NOTIFICATIONS_TABLE_NAME).insert({
      email,
      subscriptionArn: SubscriptionArn
    }, '*');
  }

  public async unsubscribe(email: string): Promise<void> {
    const notification = await this.db<Notification>(NOTIFICATIONS_TABLE_NAME).where({ email }).first()

    if (!notification) {
      throw new Error(`Notification with email = $${email} not found in db`);
    }

    await this.sns.unsubscribe({
      SubscriptionArn: notification.subscriptionArn,
    })
  }
}

export const notificationsService = new NotificationsService();
