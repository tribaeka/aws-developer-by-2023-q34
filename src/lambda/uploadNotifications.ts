import { SNS, SQS } from 'aws-sdk';

const sns = new SNS();
const sqs = new SQS();

const SNS_TOPIC_ARN = 'arn:aws:sns:us-east-2:763233212644:yahor-hlushak-UploadsNotificationTopic';
const SQS_URL = 'https://sqs.us-east-2.amazonaws.com/763233212644/yahor-hlushak-UploadsNotificationQueue';

export const handler = async (event: { Records: Record<string, string>[] }) => {
  for (const message of event.Records) {
    const imageMetadata = JSON.parse(message.body || '');
    const snsMessage = `
        An image has been uploaded at ${new Date(imageMetadata.updatedAt).toDateString()}:
        Name: ${imageMetadata.name}
        Extension: ${imageMetadata.extension}
        Size: ${imageMetadata.size}
        Download link: ${imageMetadata.downloadUrl}
        `;

    await sns.publish({
      Subject: 'New image upload',
      Message: snsMessage,
      TopicArn: SNS_TOPIC_ARN,
    }).promise();
    await sqs.deleteMessage({
      QueueUrl: SQS_URL,
      ReceiptHandle: message.receiptHandle,
    }).promise();
  }

  return `Successfully processed ${event.Records.length} messages.`;
};
