import { NextResponse } from "next/server";
import { readUsageBaseline, FALLBACK_TX_KWH } from "@/lib/usage-baseline";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/usage-baseline?region=TX
 *  Returns the cached EIA-derived monthly average kWh for the region, plus the
 *  data window so the UI can attribute the source. Falls back gracefully when
 *  the table is empty / not yet seeded.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const region = url.searchParams.get("region") ?? "TX";
  const baseline = await readUsageBaseline(region);
  if (!baseline) {
    return NextResponse.json({
      region,
      monthlyAvgKwh: FALLBACK_TX_KWH,
      source: "fallback",
      dataStart: null,
      dataEnd: null,
      monthlyBreakdown: null,
    });
  }
  return NextResponse.json({
    region: baseline.region,
    monthlyAvgKwh: baseline.monthlyAvgKwh,
    source: baseline.source,
    dataStart: baseline.dataStart,
    dataEnd: baseline.dataEnd,
    monthlyBreakdown: baseline.monthlyBreakdown,
  });
}
