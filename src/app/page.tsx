import FloatingNav from "@/components/FloatingNav";
import PlanCarousel from "@/components/PlanCarousel";
import WaitlistForm from "@/components/WaitlistForm";
import { Inter, Inter_Tight } from "next/font/google";

const displayFont = Inter_Tight({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const STEPS = [
  {
    n: "01",
    title: "Enter your ZIP",
    body: "We pull every plan available to your specific Texas service area — not a generic statewide list.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Tell us what matters",
    body: "Fixed or variable, contract length, renewable mix, no-deposit, billing style, ideal price — your priorities, your call.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="18" x2="20" y2="18" />
        <circle cx="9" cy="6" r="2" fill="currentColor" />
        <circle cx="15" cy="12" r="2" fill="currentColor" />
        <circle cx="7" cy="18" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Get an AI-ranked match",
    body: "Texergy reads the fine print, normalizes the rate structures, and ranks the plans that actually fit you.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M12 2 9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5Z" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "Cuts through the fine print",
    body: "Bill credits, tiered rates, TDU pass-throughs, base fees — all factored into the real cost for your usage.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
        <path d="M14 2v6h6" />
        <path d="M9 13h6M9 17h4" />
      </svg>
    ),
  },
  {
    title: "No hidden incentives",
    body: "We don't take payouts to push specific providers. Recommendations follow your priorities, not ours.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Built for Texas",
    body: "Roughly 85% of Texans live in deregulated ERCOT zones with the freedom to choose their provider — Texergy is built for that market and how Texans actually shop for power.",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" width="20" height="20" aria-hidden>
        <path d="M12 2.5 14.39 9.26 21.5 9.55 15.93 13.93 17.86 20.78 12 16.9 6.14 20.78 8.07 13.93 2.5 9.55 9.61 9.26z" />
      </svg>
    ),
  },
  {
    title: "Updates as the market moves",
    body: "Rates change constantly. Texergy AI tracks them so a great match today doesn't become a bad bill tomorrow.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
        <path d="M3 17 9 11l4 4 8-8" />
        <path d="M14 7h7v7" />
      </svg>
    ),
  },
];

function BoltMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="14"
      height="14"
      aria-hidden
    >
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" fill="currentColor" />
    </svg>
  );
}

export default function HomePage() {
  return (
    <main
      id="top"
      className={`${displayFont.variable} ${bodyFont.variable} relative min-h-screen overflow-x-clip`}
    >
      <FloatingNav />

      {/* Background layers */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-fiber" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-noise" />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* Hero */}
      <section
        id="waitlist"
        className="relative mx-auto max-w-6xl px-6 pt-36 sm:pt-44 pb-24 text-center fade-up"
      >
        <div className="flex justify-center mb-8">
          <span className="badge-glow body-type inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-ember-200">
            <BoltMark />
            Early access · Texas residents only
          </span>
        </div>

        <h1 className="display-type text-6xl sm:text-7xl md:text-[7.5rem] font-semibold tracking-tight">
          <span className="title-gradient">Texergy AI</span>
        </h1>

        <p className="body-type body-type-hero hero-copy-depth mx-auto mt-6 max-w-2xl text-lg sm:text-2xl text-zinc-200 leading-snug font-medium">
          Join our waitlist to discover the perfect electricity plan for you—
          powered by AI and completely free.
        </p>

        <div className="mt-10">
          <WaitlistForm />
        </div>

        <PlanCarousel />
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="divider" />
      </div>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20 scroll-mt-24">
        <div className="text-center mb-14">
          <p className="body-type text-[22px] uppercase tracking-[0.22em] text-ember-400 mb-4 font-medium">
            How it works
          </p>
          <h2 className="section-heading text-3xl sm:text-5xl text-zinc-50 tracking-tight">
            Three steps to a smarter electricity bill
          </h2>
          <p className="body-type mx-auto mt-4 max-w-xl text-zinc-400">
            Skip the spreadsheet. Skip the sales calls. Get a real recommendation in seconds.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="card card-hover rounded-2xl p-6 text-left"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="step-icon">{s.icon}</span>
                <span
                  className="display-type text-xs tabular-nums"
                  style={{ color: "rgba(255,148,77,0.55)" }}
                >
                  {s.n}
                </span>
              </div>
              <h3 className="display-type text-lg font-semibold text-zinc-100 mb-2">
                {s.title}
              </h3>
              <p className="body-type text-sm text-zinc-400 leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="divider" />
      </div>

      {/* Why */}
      <section id="why" className="relative mx-auto max-w-6xl px-6 pt-20 pb-14 scroll-mt-24">
        <span aria-hidden className="section-glow-br" />
        <div className="text-center mb-14">
          <p className="body-type text-[22px] uppercase tracking-[0.22em] text-ember-400 mb-4 font-medium">
            Why Texergy
          </p>
          <h2 className="section-heading text-3xl sm:text-5xl text-zinc-50 tracking-tight">
            Built for the way Texans actually shop for power
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <div key={f.title} className="card card-hover rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <span className="step-icon shrink-0">{f.icon}</span>
                <div>
                  <h3 className="display-type text-base font-semibold text-zinc-100 mb-1.5">
                    {f.title}
                  </h3>
                  <p className="body-type text-sm text-zinc-400 leading-relaxed">
                    {f.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <div className="divider" />
      </div>

      {/* Contact */}
      <section
        id="contact"
        className="relative mx-auto max-w-3xl px-6 pt-16 pb-10 scroll-mt-24 text-center"
      >
        <span aria-hidden className="section-glow-tl" />
        <p className="body-type text-[22px] uppercase tracking-[0.22em] text-ember-400 mb-4 font-medium">
          Contact
        </p>
        <h2 className="section-heading text-3xl sm:text-5xl text-zinc-50 tracking-tight mb-4">
          Questions? Partnerships? Just curious?
        </h2>
        <p className="body-type text-zinc-400 mb-8 leading-relaxed">
          We'd love to hear from you. Drop us a line and we'll get back as soon
          as we can.
        </p>
        <a
          href="mailto:hello@texergy.ai"
          className="inline-flex items-center gap-3 card card-hover rounded-2xl px-6 py-4 text-zinc-100"
        >
          <span className="step-icon" style={{ width: 36, height: 36 }}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
              </svg>
          </span>
          <span className="text-base font-medium">hello@texergy.ai</span>
        </a>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] relative">
        <div className="mx-auto max-w-6xl px-6 pt-8 pb-14 sm:pt-10 sm:pb-16">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1.35fr]">
            <div className="max-w-sm">
              <div className="flex items-center">
                <p className="display-type brand-gradient text-2xl font-semibold tracking-tight whitespace-nowrap">
                  Texergy AI
                </p>
              </div>

              <p className="mt-5 text-sm leading-7 text-zinc-400">
                A focused Texas electricity helper that reads the fine print,
                ranks plans by fit, and keeps the experience clear from the
                first ZIP code to the final recommendation.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="#waitlist"
                  className="btn-ghost rounded-full px-4 py-2 text-sm"
                >
                  Join waitlist
                </a>
                <a
                  href="mailto:hello@texergy.ai"
                  className="btn-ghost rounded-full px-4 py-2 text-sm"
                >
                  hello@texergy.ai
                </a>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">
                  Product
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                  <li><a href="#waitlist" className="footer-link">Waitlist</a></li>
                  <li><a href="#how" className="footer-link">How it works</a></li>
                  <li><a href="#why" className="footer-link">Why Texergy</a></li>
                  <li><a href="#contact" className="footer-link">Contact</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">
                  Company
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                  <li><a href="mailto:hello@texergy.ai" className="footer-link">hello@texergy.ai</a></li>
                  <li><span className="footer-muted">Austin, Texas</span></li>
                  <li><a href="/blog" className="footer-link">Blog</a></li>
                  <li><a href="/faq" className="footer-link">FAQ</a></li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">
                  Legal
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                  <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
                  <li><a href="/terms" className="footer-link">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
