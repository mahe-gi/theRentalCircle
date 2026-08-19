import { drizzle as drizzleD1, type AnyD1Database } from 'drizzle-orm/d1';
import { createRequire } from 'node:module';
import * as schema from './schema';

export type Database = any;

const require = createRequire(import.meta.url);
let localDbInstance: any = null;

export function getDb(d1?: AnyD1Database): Database {
  if (d1) {
    return drizzleD1(d1, { schema });
  }

  // Local persistent SQLite database for Node.js / Docker / local dev
  if (!localDbInstance && typeof process !== 'undefined' && process.versions?.node) {
    try {
      const { DatabaseSync } = require('node:sqlite');
      const { drizzle } = require('drizzle-orm/sqlite-proxy');
      const path = require('path');
      const dbPath = path.join(process.cwd(), 'trc-dev.sqlite');
      const dbFile = new DatabaseSync(dbPath);

      // Ensure core Better Auth tables exist
      dbFile.exec(`
        CREATE TABLE IF NOT EXISTS user (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          email_verified INTEGER DEFAULT 0 NOT NULL,
          image TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL,
          role TEXT DEFAULT 'user' NOT NULL,
          phone_hash TEXT,
          encrypted_phone TEXT,
          phone_verified INTEGER DEFAULT 0 NOT NULL,
          phone_confirmed_at INTEGER,
          phone_confirmed_by TEXT,
          phone_confirmation_method TEXT,
          is_banned INTEGER DEFAULT 0 NOT NULL
        );
        CREATE TABLE IF NOT EXISTS session (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES user(id),
          token TEXT NOT NULL UNIQUE,
          expires_at INTEGER NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS account (
          id TEXT PRIMARY KEY,
          user_id TEXT NOT NULL REFERENCES user(id),
          account_id TEXT NOT NULL,
          provider_id TEXT NOT NULL,
          access_token TEXT,
          refresh_token TEXT,
          id_token TEXT,
          access_token_expires_at INTEGER,
          refresh_token_expires_at INTEGER,
          scope TEXT,
          password TEXT,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
        CREATE TABLE IF NOT EXISTS verification (
          id TEXT PRIMARY KEY,
          identifier TEXT NOT NULL,
          value TEXT NOT NULL,
          expires_at INTEGER NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        );
      `);

      localDbInstance = drizzle(async (sql: string, params: any[], method: string) => {
        try {
          const stmt = dbFile.prepare(sql);
          if (method === 'all' || method === 'values') {
            const rows = stmt.all(...params);
            return { rows: rows.map((r: any) => Object.values(r)) };
          } else if (method === 'get') {
            const row = stmt.get(...params);
            return { rows: row ? Object.values(row) : [] };
          } else if (method === 'run') {
            stmt.run(...params);
            return { rows: [] };
          }
          const rows = stmt.all(...params);
          return { rows: rows.map((r: any) => Object.values(r)) };
        } catch (e: any) {
          console.error('Local SQLite Query Error:', e.message, sql);
          throw e;
        }
      }, { schema });
    } catch (err) {
      console.warn('Failed to initialize local SQLite DatabaseSync:', err);
    }
  }

  return localDbInstance;
}

export { schema };