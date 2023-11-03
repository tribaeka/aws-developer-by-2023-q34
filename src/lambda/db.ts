import { Image } from '../types';
import { KNEX_CONFIG } from '../config/knex.constants';
import { knex } from 'knex';

const db = knex<Image>(KNEX_CONFIG);
export default db;
