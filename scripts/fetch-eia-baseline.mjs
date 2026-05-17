#!/usr/bin/env node
/**
 * Fetches Texas residential electricity usage from the EIA v2 API and upserts a
 * single baseline row into `usage_baselines`. We pull the last 12 months of
 * `sales` (million kWh) and `customers`, compute mean kWh-per-customer, and
 * store both the average and a monthly breakdown for later seasonal use.
 *
 *   node scripts/fetch-eia-baseline.mjs
 *
 * Reads EIA_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY from
 * .env.local. Safe to run on a cron — table has unique(region, source).
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

async function fetchTxResidential(months = 12) {
  // EIA returns one row per (state, sector, period). sales is in *million kWh*.
  const url = new URL("https://api.eia.gov/v2/electricity/retail-sales/data");
  url.searchParams.set("api_key", EIA_KEY);
  url.searchParams.set("frequency", "monthly");
  url.searchParams.append("data[0]", "sales");
  url.searchParams.append("data[1]", "customers");
  url.searchParams.append("facets[stateid][]", "TX");
  url.searchParams.append("facets[sectorid][]", "RES");
  url.searchParams.append("sort[0][column]", "period");
  url.searchParams.append("sort[0][direction]", "desc");
  url.searchParams.set("offset", "0");
  url.searchParams.set("length", String(months));

  const res = await fetch(url);
  if (!res.ok) throw new Error(`EIA HTTP ${res.status}: ${await res.text()}`);
  const json = await res.json();
  const rows = json?.response?.data;
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("EIA returned no rows");
  }
  return rows.map((r) => ({
    period: r.period, // "YYYY-MM"
    salesMillionKwh: Number(r.sales),
    customers: Number(r.customers),
  }));
}

function computeBaseline(rows) {
  // Mean kWh-per-customer across the window, and a per-month breakdown so we
  // can build seasonal multipliers later. Per-month here means month-of-year
  // (01..12) averaged if we ever pull more than 12 months — for now there's
  // one entry per month.
  const perMonth = {}; // "MM" → [kwh-per-customer]
  let totalKwh = 0;
  let totalCustomerMonths = 0;
  for (const row of rows) {
    if (!row.customers || row.customers <= 0) continue;
    const kwhPerCustomer = (row.salesMillionKwh * 1_000_000) / row.customers;
    const mm = row.period.slice(5, 7);
    (perMonth[mm] ??= []).push(kwhPerCustomer);
    totalKwh += row.salesMillionKwh * 1_000_000;
    totalCustomerMonths += row.customers;
  }
  if (totalCustomerMonths === 0) throw new Error("All EIA rows had 0 customers");

  const avg = totalKwh / totalCustomerMonths;
  const breakdown = Object.fromEntries(
    Object.entries(perMonth).map(([mm, arr]) => [
      mm,
      Math.round(arr.reduce((s, v) => s + v, 0) / arr.length),
    ]),
  );
  const periods = rows.map((r) => r.period).sort();
  return {
    monthlyAvgKwh: Math.round(avg),
    monthlyBreakdown: breakdown,
    dataStart: `${periods[0]}-01`,
    dataEnd: `${periods[periods.length - 1]}-01`,
  };
}

async function main() {
  console.log("Fetching last 12 months of TX residential usage from EIA…");
  const rows = await fetchTxResidential(12);
  console.log(`  got ${rows.length} rows (${rows[rows.length - 1].period} … ${rows[0].period})`);

  const baseline = computeBaseline(rows);
  console.log(`  computed avg = ${baseline.monthlyAvgKwh} kWh/mo`);
  console.log("  monthly breakdown:", baseline.monthlyBreakdown);

  const { error } = await supabase
    .from("usage_baselines")
    .upsert(
      {
        region: "TX",
        source: "eia",
        monthly_avg_kwh: baseline.monthlyAvgKwh,
        monthly_breakdown: baseline.monthlyBreakdown,
        data_start: baseline.dataStart,
        data_end: baseline.dataEnd,
        refreshed_at: new Date().toISOString(),
      },
      { onConflict: "region,source" },
    );
  if (error) throw error;
  console.log("Saved baseline to usage_baselines.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
