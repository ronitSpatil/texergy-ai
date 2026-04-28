import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Texergy AI",
  description: "Field notes on the Texas electricity market.",
};

const UPCOMING = [
  {
    title: "How to read an Electricity Facts Label without falling asleep",
    body: "Bill credits, average prices, base fees, TDU pass-throughs — what each line on the EFL actually means and which ones quietly inflate your real cost.",
  },
  {
    title: "Why the cheapest headline rate is almost never the cheapest plan",
    body: "A walkthrough of three real plans where the lowest 'cents per kWh' figure ends up costing more annually than the second- or third-cheapest.",
  },
  {
    title: "ERCOT 101 for new Texans",
    body: "What 'deregulated' means, what your TDU does (vs. your retail provider), and what happens when something goes wrong with your power.",
  },
  {
    title: "Variable vs. fixed rate plans: when each one actually wins",
    body: "Variable rates aren't always the trap they're made out to be — and fixed isn't always safer than it looks. A practical decision tree.",
  },
];

export default function BlogPage() {
  return (
    <article className="mx-auto max-w-3xl px-6">
      <header className="mb-12 text-center">
        <p className="body-type text-[22px] uppercase tracking-[0.22em] text-ember-400 mb-4 font-medium">
          Blog
        </p>
        <h1 className="section-heading text-4xl sm:text-5xl text-zinc-50 tracking-tight">
          Field notes from the Texas grid.
        </h1>
        <p className="body-type mt-5 text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Plain-English writing about retail electricity, ERCOT, and how to
          stop overpaying for your bill. First post drops alongside early
          access — these are the topics in the queue.
        </p>
      </header>

      <div className="grid gap-4 sm:gap-5">
        {UPCOMING.map((post) => (
          <article
            key={post.title}
            className="card rounded-2xl p-6 sm:p-7 relative"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="body-type inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                Coming soon
              </span>
            </div>
            <h2 className="display-type text-lg sm:text-xl font-semibold text-zinc-100 mb-2 leading-snug">
              {post.title}
            </h2>
            <p className="body-type text-sm text-zinc-400 leading-relaxed">
              {post.body}
            </p>
          </article>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="body-type text-zinc-400 mb-5">
          Want these in your inbox the moment they go live?
        </p>
        <a
          href="/#waitlist"
          className="btn-primary inline-flex items-center rounded-full px-6 py-3 text-sm"
        >
          Join the waitlist
        </a>
      </div>

      <div className="mt-16 pt-8 border-t border-white/[0.06] text-sm text-zinc-500 text-center">
        <a href="/" className="footer-link hover:text-zinc-200">
          ← Back to home
        </a>
      </div>
    </article>
  );
}
