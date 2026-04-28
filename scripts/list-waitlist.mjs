#!/usr/bin/env node
/**
 * Quick CLI viewer for the waitlist DB.
 *
 * Usage:
 *   npm run waitlist:list           # pretty table to stdout
 *   npm run waitlist:list -- --csv  # CSV to stdout (pipe to a file)
 *   npm run waitlist:list -- --json # JSON array to stdout
 *
 * Picks Turso when TURSO_DATABASE_URL + TURSO_AUTH_TOKEN are set,
 * otherwise reads the local SQLite file at ./data/waitlist.db.
 */

import { createClient } from "@libsql/client";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";

// Tiny .env.local loader so the script picks up Turso creds without dotenv dep.
function loadEnvLocal() {
  const p = ".env.local";
  if (!existsSync(p)) return;
  const text = readFileSync(p, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnvLocal();

const args = new Set(process.argv.slice(2));
const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const LOCAL_PATH = process.env.WAITLIST_DB_PATH ?? "./data/waitlist.db";

let client;
let source;
if (TURSO_URL && TURSO_TOKEN) {
  client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
  source = TURSO_URL;
} else {
  if (!existsSync(LOCAL_PATH)) {
    console.error(`No waitlist DB at ${path.resolve(LOCAL_PATH)}`);
    console.error("Has anyone joined the waitlist yet?");
    process.exit(1);
  }
  client = createClient({ url: `file:${LOCAL_PATH}` });
  source = path.resolve(LOCAL_PATH);
}

const result = await client.execute(
  "SELECT id, email, zip, referrer, created_at FROM waitlist ORDER BY created_at DESC",
);
const rows = result.rows.map((r) => ({
  id: Number(r.id),
  email: String(r.email),
  zip: r.zip == null ? null : String(r.zip),
  referrer: r.referrer == null ? null : String(r.referrer),
  created_at: Number(r.created_at),
}));

const fmt = (ts) =>
  new Date(ts).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "Z");

if (args.has("--json")) {
  process.stdout.write(
    JSON.stringify(
      rows.map((r) => ({ ...r, created_at_iso: fmt(r.created_at) })),
      null,
      2,
    ) + "\n",
  );
  process.exit(0);
}

if (args.has("--csv")) {
  const safe = (v) => {
    if (v == null) return "";
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  process.stdout.write("id,email,zip,referrer,created_at_iso\n");
  for (const r of rows) {
    process.stdout.write(
      [r.id, safe(r.email), safe(r.zip), safe(r.referrer), fmt(r.created_at)].join(",") + "\n",
    );
  }
  process.exit(0);
}

if (rows.length === 0) {
  console.log("(no signups yet)");
  console.log(`source: ${source}`);
  process.exit(0);
}

const cols = [
  { key: "id", label: "ID", w: 5 },
  { key: "email", label: "Email", w: 36 },
  { key: "zip", label: "ZIP", w: 6 },
  { key: "joined", label: "Joined (UTC)", w: 22 },
];
const pad = (s, w) => {
  s = s == null ? "" : String(s);
  return s.length >= w ? s.slice(0, w - 1) + "…" : s + " ".repeat(w - s.length);
};

console.log(cols.map((c) => pad(c.label, c.w)).join("  "));
console.log(cols.map((c) => "─".repeat(c.w)).join("  "));
for (const r of rows) {
  console.log(
    [
      pad(r.id, cols[0].w),
      pad(r.email, cols[1].w),
      pad(r.zip ?? "—", cols[2].w),
      pad(fmt(r.created_at), cols[3].w),
    ].join("  "),
  );
}
console.log("");
console.log(`${rows.length} ${rows.length === 1 ? "signup" : "signups"} · ${source}`);
