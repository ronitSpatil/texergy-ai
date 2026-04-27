#!/usr/bin/env node
/**
 * Quick CLI viewer for the waitlist DB.
 *
 * Usage:
 *   npm run waitlist:list           # pretty table to stdout
 *   npm run waitlist:list -- --csv  # CSV to stdout (pipe to a file)
 *   npm run waitlist:list -- --json # JSON array to stdout
 *
 * Reads from $WAITLIST_DB_PATH or ./data/waitlist.db.
 */

import Database from "better-sqlite3";
import path from "node:path";
import { existsSync } from "node:fs";

const DB_PATH = process.env.WAITLIST_DB_PATH ?? "./data/waitlist.db";
const args = new Set(process.argv.slice(2));

if (!existsSync(DB_PATH)) {
  console.error(`No waitlist DB at ${path.resolve(DB_PATH)}`);
  console.error("Has anyone joined the waitlist yet?");
  process.exit(1);
}

const db = new Database(DB_PATH, { readonly: true });
const rows = db
  .prepare(
    "SELECT id, email, zip, referrer, created_at FROM waitlist ORDER BY created_at DESC",
  )
  .all();
const total = rows.length;

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
      [r.id, safe(r.email), safe(r.zip), safe(r.referrer), fmt(r.created_at)].join(",") +
        "\n",
    );
  }
  process.exit(0);
}

// Pretty table
if (total === 0) {
  console.log("(no signups yet)");
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
console.log(`${total} ${total === 1 ? "signup" : "signups"} · ${path.resolve(DB_PATH)}`);
