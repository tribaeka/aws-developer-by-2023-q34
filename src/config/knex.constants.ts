import { Knex } from 'knex';
import * as fs from 'fs';
import path from 'path';

const caCertificate = fs.readFileSync(path.join(__dirname, 'rds-ca-2019-root.pem'));
export const IMAGES_TABLE_NAME = 'images';
export const NOTIFICATIONS_TABLE_NAME = 'notifications';
export const KNEX_CONFIG: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'yahor-hlushak-rds.cithjq6js4st.us-east-2.rds.amazonaws.com',
    user: 'postgres',
    password: 'postgres',
    database: 'images',
    port: 5432,
    ssl: {
      ca: caCertificate
    }
  },
}
