#!/usr/bin/env node
/**
 * Seeds reps.complaint_rate_per_1000 from a JSON file. Format:
 *
 *   {
 *     "period": "Sep 2025 - Feb 2026",
 *     "source_url": "https://www.puc.texas.gov/...",
 *     "rates": [
 *       { "rep_name": "Reliant Energy", "rate": 0.20 },
 *       { "rep_name": "TXU Energy",     "rate": 0.19 },
 *       ...
 *     ]
 *   }
 *
 *   node scripts/seed-rep-complaints.mjs data/puc-scorecard.json
 *
 * Match is on reps.name (case-insensitive trim). Misses are logged but
 * don't fail the run — eyeball them and add an alias to the source file
 * if needed.
 *
 * Reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from .env.local.
 */

import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync } from "node:fs";

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

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Usage: node scripts/seed-rep-complaints.mjs <path-to-json>");
  process.exit(1);
}

const payload = JSON.parse(readFileSync(inputPath, "utf8"));
if (!Array.isArray(payload.rates)) {
  console.error("Input JSON must have a `rates` array.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false } });

const { data: reps, error } = await supabase.from("reps").select("id, name");
if (error) {
  console.error("Failed to fetch reps:", error);
  process.exit(1);
}

const byName = new Map(reps.map((r) => [r.name.trim().toLowerCase(), r]));

let updated = 0;
const missing = [];
for (const row of payload.rates) {
  const key = String(row.rep_name ?? "").trim().toLowerCase();
  const match = byName.get(key);
  if (!match) {
    missing.push(row.rep_name);
    continue;
  }
  const { error: upErr } = await supabase
    .from("reps")
    .update({
      complaint_rate_per_1000: row.rate,
      complaints_period: payload.period ?? null,
      complaints_source_url: payload.source_url ?? null,
    })
    .eq("id", match.id);
  if (upErr) {
    console.error(`Update failed for ${match.name}:`, upErr);
    continue;
  }
  updated++;
}

console.log(`Updated ${updated} reps.`);
if (missing.length > 0) {
  console.log(`No DB match for ${missing.length} entries (check spelling / aliases):`);
  for (const m of missing) console.log(`  - ${m}`);
}
