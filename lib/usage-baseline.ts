import { createClient } from "@supabase/supabase-js";

const FALLBACK_TX_KWH = 1000;

export type UsageBaseline = {
  region: string;
  monthlyAvgKwh: number;
  monthlyBreakdown: Record<string, number> | null;
  dataStart: string | null;
  dataEnd: string | null;
  source: string;
  refreshedAt: string;
};

/** Server-only baseline reader. Returns the most recent EIA-derived TX
 *  residential baseline, or null if the table is empty / Supabase is misconfigured.
 *  Callers should fall back to FALLBACK_TX_KWH when null.
 */
export async function readUsageBaseline(region = "TX"): Promise<UsageBaseline | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase
    .from("usage_baselines")
    .select("region, source, monthly_avg_kwh, monthly_breakdown, data_start, data_end, refreshed_at")
    .eq("region", region)
    .eq("source", "eia")
    .maybeSingle();
  if (error || !data) return null;
  return {
    region: data.region,
    source: data.source,
    monthlyAvgKwh: Number(data.monthly_avg_kwh),
    monthlyBreakdown: data.monthly_breakdown ?? null,
    dataStart: data.data_start,
    dataEnd: data.data_end,
    refreshedAt: data.refreshed_at,
  };
}

/** Convenience: get just the kWh number with a built-in fallback. */
export async function getMonthlyAverageKwh(region = "TX"): Promise<number> {
  const baseline = await readUsageBaseline(region);
  return baseline?.monthlyAvgKwh ?? FALLBACK_TX_KWH;
}

export { FALLBACK_TX_KWH };
