import { createClient } from "@supabase/supabase-js";

export type PriceHistory = {
  region: string;
  sector: string;
  source: string;
  series: Record<string, number>; // {"YYYY-MM": cents/kWh}
  trailing12moAvgCents: number | null;
  trailing12moStdCents: number | null;
  trailing6moSlopeCentsPerMonth: number | null;
  latestPeriod: string | null;
  refreshedAt: string;
};

/** Server-only reader. Returns the TX residential price-history row written by
 *  scripts/fetch-eia-prices.mjs, or null if the table is empty / unconfigured.
 *  Callers should degrade gracefully (no market signal) when null.
 */
export async function readPriceHistory(
  region = "TX",
  sector = "RES",
): Promise<PriceHistory | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("price_history")
    .select(
      "region, sector, source, series, trailing_12mo_avg_cents, trailing_12mo_std_cents, trailing_6mo_slope_cents_per_month, latest_period, refreshed_at",
    )
    .eq("region", region)
    .eq("sector", sector)
    .eq("source", "eia")
    .maybeSingle();
  if (error || !data) return null;

  return {
    region: data.region,
    sector: data.sector,
    source: data.source,
    series: (data.series as Record<string, number>) ?? {},
    trailing12moAvgCents: numericOrNull(data.trailing_12mo_avg_cents),
    trailing12moStdCents: numericOrNull(data.trailing_12mo_std_cents),
    trailing6moSlopeCentsPerMonth: numericOrNull(data.trailing_6mo_slope_cents_per_month),
    latestPeriod: data.latest_period,
    refreshedAt: data.refreshed_at,
  };
}

function numericOrNull(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

/** Compact market context the scoring engine consumes. */
export type MarketContext = {
  trailingAvgCents: number;
  trailingStdCents: number;
  trailing6moSlopeCentsPerMonth: number;
  latestPeriod: string | null;
};

export function toMarketContext(h: PriceHistory | null): MarketContext | null {
  if (!h || h.trailing12moAvgCents == null) return null;
  return {
    trailingAvgCents: h.trailing12moAvgCents,
    trailingStdCents: h.trailing12moStdCents ?? 0,
    trailing6moSlopeCentsPerMonth: h.trailing6moSlopeCentsPerMonth ?? 0,
    latestPeriod: h.latestPeriod,
  };
}
