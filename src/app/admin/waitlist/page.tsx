import { listWaitlist, waitlistCount } from "@/lib/db";
import { emailConfigured } from "@/lib/email";
import { adminTokenMatches } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fmt(ts: number): string {
  return new Date(ts).toISOString().replace("T", " ").replace(/\.\d{3}Z$/, "Z");
}

export default async function WaitlistAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!process.env.ADMIN_TOKEN) {
    return (
      <main className="min-h-screen bg-[#15161b] text-zinc-200 p-8 font-sans">
        <h1 className="text-2xl font-semibold mb-4">Admin disabled</h1>
        <p className="text-zinc-400 max-w-xl leading-relaxed">
          Set <code className="bg-white/5 px-1.5 py-0.5 rounded">ADMIN_TOKEN</code>{" "}
          in <code className="bg-white/5 px-1.5 py-0.5 rounded">.env.local</code>,
          restart the dev server, then visit{" "}
          <code className="bg-white/5 px-1.5 py-0.5 rounded">
            /admin/waitlist?token=YOUR_TOKEN
          </code>
          .
        </p>
      </main>
    );
  }

  if (!adminTokenMatches(token ?? null)) {
    return (
      <main className="min-h-screen bg-[#15161b] text-zinc-200 p-8 font-sans">
        <h1 className="text-2xl font-semibold mb-2">403 — Not authorized</h1>
        <p className="text-zinc-400 text-sm">
          Append <code className="bg-white/5 px-1.5 py-0.5 rounded">?token=…</code>{" "}
          to the URL with your admin token.
        </p>
      </main>
    );
  }

  const rows = await listWaitlist({ limit: 1000 });
  const total = await waitlistCount();

  return (
    <main className="min-h-screen bg-[#15161b] text-zinc-200 p-6 sm:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-end justify-between flex-wrap gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">
              Waitlist
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              {total} {total === 1 ? "signup" : "signups"} ·{" "}
              <span
                className={
                  emailConfigured() ? "text-emerald-400" : "text-amber-400"
                }
              >
                {emailConfigured()
                  ? "Confirmation emails enabled"
                  : "Confirmation emails disabled (set RESEND_API_KEY)"}
              </span>
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href={`/admin/waitlist/export?token=${encodeURIComponent(token ?? "")}`}
              className="text-xs px-3 py-1.5 rounded-md border border-white/10 hover:border-white/20 hover:bg-white/5"
            >
              Export CSV
            </a>
          </div>
        </header>

        {rows.length === 0 ? (
          <p className="text-zinc-500 text-sm">No signups yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-white/[0.03] text-left">
                <tr className="text-xs uppercase tracking-wider text-zinc-500">
                  <th className="px-4 py-3 font-medium w-12">#</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium w-20">ZIP</th>
                  <th className="px-4 py-3 font-medium w-56">Joined (UTC)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-white/[0.02]">
                    <td className="px-4 py-3 text-zinc-500 tabular-nums">
                      {r.id}
                    </td>
                    <td className="px-4 py-3 text-zinc-100 break-all">
                      {r.email}
                    </td>
                    <td className="px-4 py-3 text-zinc-300 tabular-nums">
                      {r.zip ?? <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 font-mono text-xs">
                      {fmt(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
