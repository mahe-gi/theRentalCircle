import { drizzle, type DrizzleD1Database, type AnyD1Database } from 'drizzle-orm/d1';
import * as schema from './schema';

export type Database = DrizzleD1Database<typeof schema>;

export function getDb(d1: AnyD1Database): Database {
  return drizzle(d1, { schema });
}

export { schema };