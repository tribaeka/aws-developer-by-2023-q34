import { Knex } from 'knex';

export const IMAGES_TABLE_NAME = 'images';
export const KNEX_CONFIG: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'postgres',
    database: 'images',
    port: 5432
  },
}
