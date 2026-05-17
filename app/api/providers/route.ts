import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** GET /api/providers
 *  Returns { providers: [{ id, name }, ...] } sorted alphabetically.
 *  Used by the results sidebar to render the "filter by provider" checkbox
 *  dropdown. Limited to REPs that have at least one active plan so the list
 *  doesn't show defunct companies.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return NextResponse.json({ providers: [] });
  }
  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Pull active plans' distinct rep_ids, then resolve names.
  const { data: planRows } = await supabase
    .from("plans")
    .select("rep_id")
    .eq("active", true);
  const repIds = Array.from(
    new Set((planRows ?? []).map((r) => Number((r as { rep_id: number }).rep_id))),
  );
  if (repIds.length === 0) return NextResponse.json({ providers: [] });

  const { data: reps } = await supabase
    .from("reps")
    .select("id, name")
    .in("id", repIds)
    .order("name", { ascending: true });

  return NextResponse.json({
    providers: (reps ?? []).map((r) => ({
      id: Number(r.id),
      name: String(r.name),
    })),
  });
}
