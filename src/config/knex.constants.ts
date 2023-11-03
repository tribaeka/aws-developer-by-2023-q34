import { Knex } from 'knex';
import * as fs from 'fs';
import path from 'path';

const caCertificate = fs.readFileSync(path.join(__dirname, 'rds-ca-2019-root.pem'));
export const IMAGES_TABLE_NAME = 'images';
export const KNEX_CONFIG: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'yahor-hlushak.cithjq6js4st.us-east-2.rds.amazonaws.com',
    user: 'postgres',
    password: 'postgres',
    database: 'images',
    port: 5432,
    ssl: {
      ca: caCertificate
    },
  },
  pool: {
    "min": 2,
    "max": 6,
    "createTimeoutMillis": 3000,
    "acquireTimeoutMillis": 30000,
    "idleTimeoutMillis": 30000,
    "reapIntervalMillis": 1000,
    "createRetryIntervalMillis": 100,
    "propagateCreateError": false
  }
}
