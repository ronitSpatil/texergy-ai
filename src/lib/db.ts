import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";

const DB_PATH = process.env.WAITLIST_DB_PATH ?? "./data/waitlist.db";

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (db) return db;
  mkdirSync(dirname(DB_PATH), { recursive: true });
  const instance = new Database(DB_PATH);
  instance.pragma("journal_mode = WAL");
  instance.pragma("foreign_keys = ON");
  instance.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      zip TEXT,
      referrer TEXT,
      created_at INTEGER NOT NULL,
      ip_hash TEXT
    );
    CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at);
  `);
  db = instance;
  return db;
}

export type WaitlistInsert = {
  email: string;
  zip?: string | null;
  referrer?: string | null;
  ipHash?: string | null;
};

export function addToWaitlist(entry: WaitlistInsert): { inserted: boolean } {
  const stmt = getDb().prepare(
    `INSERT OR IGNORE INTO waitlist (email, zip, referrer, created_at, ip_hash)
     VALUES (@email, @zip, @referrer, @created_at, @ip_hash)`,
  );
  const result = stmt.run({
    email: entry.email,
    zip: entry.zip ?? null,
    referrer: entry.referrer ?? null,
    created_at: Date.now(),
    ip_hash: entry.ipHash ?? null,
  });
  return { inserted: result.changes > 0 };
}

export function waitlistCount(): number {
  const row = getDb().prepare(`SELECT COUNT(*) as c FROM waitlist`).get() as
    | { c: number }
    | undefined;
  return row?.c ?? 0;
}

export type WaitlistRow = {
  id: number;
  email: string;
  zip: string | null;
  referrer: string | null;
  created_at: number;
};

export function listWaitlist(opts: { limit?: number; offset?: number } = {}): WaitlistRow[] {
  const limit = Math.min(Math.max(opts.limit ?? 200, 1), 1000);
  const offset = Math.max(opts.offset ?? 0, 0);
  return getDb()
    .prepare(
      `SELECT id, email, zip, referrer, created_at
       FROM waitlist
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
    )
    .all(limit, offset) as WaitlistRow[];
}
