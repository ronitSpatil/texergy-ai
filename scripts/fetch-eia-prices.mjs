#!/usr/bin/env node
/**
 * Fetches the full monthly TX residential retail-price series from the EIA v2
 * API (since 2021-01), computes trailing aggregates, and upserts into
 * `price_history`. These aggregates drive two ranking signals in score.ts:
 *
 *   - marketDelta: each plan's effective ¢/kWh vs. trailing-12-month TX avg
 *   - volatilityAdjustedStability: Variable plans are penalized proportional
 *     to recent market volatility (std-dev) rather than a fixed 0.25
 *
 *   node scripts/fetch-eia-prices.mjs
 *
 * Reads EIA_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY from
 * .env.local. Safe to run on a cron.
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

const EIA_KEY = process.env.EIA_API_KEY;
const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!EIA_KEY) throw new Error("EIA_API_KEY missing");
if (!SB_URL || !SB_KEY) throw new Error("Supabase env missing");

const supabase = createClient(SB_URL, SB_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function fetchPriceSeries(sector = "RES", start = "2021-01") {
  const url = new URL("https://api.eia.gov/v2/electricity/retail-sales/data/");
  url.searchParams.set("api_key", EIA_KEY);
  url.searchParams.set("frequency", "monthly");
  url.searchParams.append("data[0]", "price");
  url.searchParams.append("facets[stateid][]", "TX");
  url.searchParams.append("facets[sectorid][]", sector);
  url.searchParams.set("start", start);
  url.searchParams.append("sort[0][column]", "period");
  url.searchParams.append("sort[0][direction]", "asc");
  url.searchParams.set("offset", "0");
  url.searchParams.set("length", "5000");

  const res = await fetch(url);
  if (!res.ok) throw new Error(`EIA HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const rows = json?.response?.data;
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("EIA returned no rows");
  }
  // Build chronological {"YYYY-MM": cents} map.
  const series = {};
  for (const r of rows) series[r.period] = Number(r.price);
  return series;
}

function mean(arr) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function sampleStdDev(arr) {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1);
  return Math.sqrt(variance);
}

/** Simple least-squares slope: x = month index (0..n-1), y = price.
 *  Output is cents/kWh per month — positive means market is rising. */
function linearSlope(arr) {
  const n = arr.length;
  if (n < 2) return 0;
  const xs = arr.map((_, i) => i);
  const xMean = mean(xs);
  const yMean = mean(arr);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - xMean) * (arr[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  return den === 0 ? 0 : num / den;
}

function computeAggregates(series) {
  const periods = Object.keys(series).sort(); // ascending YYYY-MM
  const values = periods.map((p) => series[p]);

  const trailing12 = values.slice(-12);
  const trailing6 = values.slice(-6);

  return {
    latestPeriod: periods[periods.length - 1],
    trailing12moAvgCents: round2(mean(trailing12)),
    trailing12moStdCents: round2(sampleStdDev(trailing12)),
    trailing6moSlopeCentsPerMonth: round3(linearSlope(trailing6)),
  };
}

function round2(n) {
  return Math.round(n * 100) / 100;
}
function round3(n) {
  return Math.round(n * 1000) / 1000;
}

async function main() {
  const sector = "RES";
  const region = "TX";
  console.log(`Fetching TX ${sector} monthly price series since 2021-01…`);
  const series = await fetchPriceSeries(sector);
  const months = Object.keys(series).length;
  console.log(`  got ${months} months (${Object.keys(series).sort()[0]} … ${Object.keys(series).sort().pop()})`);

  const agg = computeAggregates(series);
  console.log("  trailing 12mo avg (¢/kWh):", agg.trailing12moAvgCents);
  console.log("  trailing 12mo std (¢/kWh):", agg.trailing12moStdCents);
  console.log("  trailing 6mo slope (¢/kWh/mo):", agg.trailing6moSlopeCentsPerMonth);

  const { error } = await supabase
    .from("price_history")
    .upsert(
      {
        region,
        sector,
        source: "eia",
        series,
        trailing_12mo_avg_cents: agg.trailing12moAvgCents,
        trailing_12mo_std_cents: agg.trailing12moStdCents,
        trailing_6mo_slope_cents_per_month: agg.trailing6moSlopeCentsPerMonth,
        latest_period: `${agg.latestPeriod}-01`,
        refreshed_at: new Date().toISOString(),
      },
      { onConflict: "region,sector,source" },
    );
  if (error) throw error;
  console.log("Saved price history.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
