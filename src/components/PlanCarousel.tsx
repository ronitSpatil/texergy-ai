"use client";

import { useEffect, useRef, useState } from "react";

const ROTATE_MS = 6500;
const SAMPLE_ZIP = "75201"; // downtown Dallas, ONCOR territory

type Plan = {
  rank: string;
  why: string;
  caveat?: string;
  provider: string;
  product: string;
  rating: number; // 1-5 (Power to Choose rating)
  price: string;
  priceNote: string;
  annual: string;
  attrs: string[];
};

const PLANS: Plan[] = [
  {
    rank: "Top recommendation",
    provider: "Tara Energy",
    product: "Value Choice 12",
    rating: 4,
    price: "10.4¢",
    priceNote: "/kWh @ 1000 kWh/mo",
    annual: "~$1,248 / yr",
    attrs: ["12-mo fixed", "31% renewable", "$175 ETF"],
    why: "Cheapest 12-month fixed rate at 1000 kWh in the DFW area. Locks in your rate for a year and avoids variable-bill surprises.",
  },
  {
    rank: "Greenest pick",
    provider: "Gexa Energy",
    product: "Gexa Eco Choice 12",
    rating: 5,
    price: "12.6¢",
    priceNote: "/kWh @ 1000 kWh/mo",
    annual: "~$1,512 / yr",
    attrs: ["12-mo fixed", "100% renewable", "$150 ETF"],
    why: "100% renewable energy from a top-rated provider — about $22/month more than the cheapest plan, with zero fossil mix.",
  },
  {
    rank: "Long-term lock-in",
    provider: "Champion Energy",
    product: "Champ Saver 24",
    rating: 5,
    price: "13.9¢",
    priceNote: "/kWh @ 1000 kWh/mo",
    annual: "~$1,668 / yr",
    attrs: ["24-mo fixed", "26% renewable", "$250 ETF"],
    why: "Two-year price lock. Worth it if you don't want to re-shop in 2027 and want predictable bills through the next two summers.",
  },
  {
    rank: "Brand-name pick",
    provider: "TXU Energy",
    product: "Value Edge 12",
    rating: 5,
    price: "13.9¢",
    priceNote: "/kWh @ 1000 kWh/mo",
    annual: "~$1,668 / yr",
    attrs: ["12-mo fixed", "3% renewable", "$150 ETF"],
    why: "Largest retailer in Texas with 24/7 support and a polished app. Same headline price as Champion 24, with a shorter commitment.",
  },
  {
    rank: "No-commitment pick",
    provider: "Infuse Energy",
    product: "Essential Infusion Flex",
    rating: 4,
    price: "8.9¢",
    priceNote: "/kWh, variable",
    annual: "~$1,068 / yr*",
    attrs: ["Month-to-month", "26% renewable", "No ETF"],
    why: "Lowest headline rate and zero cancellation fee — useful if you're moving soon or want flexibility.",
    caveat: "*Variable rate — your bill can change each cycle.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`Power to Choose rating: ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          aria-hidden
          fill={n <= rating ? "#ffb47a" : "rgba(255,255,255,0.12)"}
        >
          <path d="M12 2.5 14.39 9.26 21.5 9.55 15.93 13.93 17.86 20.78 12 16.9 6.14 20.78 8.07 13.93 2.5 9.55 9.61 9.26z" />
        </svg>
      ))}
    </div>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div className="mock-card relative rounded-2xl p-5 sm:p-6 text-left h-full">
      {/* Header: location pill + rating */}
      <div className="flex items-center justify-between mb-5">
        <span className="body-type inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-zinc-400">
          <span className="h-1.5 w-1.5 rounded-full bg-ember-400" />
          Match for ZIP {SAMPLE_ZIP}
        </span>
        <div className="flex items-center gap-1.5">
          <StarRating rating={plan.rating} />
          <span className="body-type text-[10px] text-zinc-500 uppercase tracking-wider">
            on PTC
          </span>
        </div>
      </div>

      {/* Rank label */}
      <div className="body-type text-[11px] uppercase tracking-[0.2em] text-ember-400 mb-2">
        {plan.rank}
      </div>

      {/* Provider + product */}
      <div className="mb-1">
        <div className="body-type text-[12px] uppercase tracking-[0.14em] text-zinc-500 mb-0.5">
          {plan.provider}
        </div>
        <div className="display-type text-xl sm:text-[22px] font-semibold text-zinc-50 leading-tight">
          {plan.product}
        </div>
      </div>

      {/* Price split: per-kWh + estimated annual */}
      <div className="mt-5 pt-5 border-t border-white/[0.06] grid grid-cols-2 gap-4">
        <div>
          <div className="display-type text-[28px] font-semibold text-zinc-50 leading-none tabular-nums">
            {plan.price}
          </div>
          <div className="body-type text-[11px] text-zinc-500 mt-2">
            {plan.priceNote}
          </div>
        </div>
        <div className="border-l border-white/[0.06] pl-4">
          <div className="display-type text-[20px] font-medium text-zinc-200 leading-none tabular-nums">
            {plan.annual}
          </div>
          <div className="body-type text-[11px] text-zinc-500 mt-2">
            est. annual cost
          </div>
        </div>
      </div>

      {/* Attribute chips */}
      <div className="flex flex-wrap gap-1.5 mt-5">
        {plan.attrs.map((a) => (
          <span
            key={a}
            className="body-type rounded-md border border-white/[0.08] bg-white/[0.02] px-2 py-1 text-[11px] text-zinc-300"
          >
            {a}
          </span>
        ))}
      </div>

      {/* Why */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <p className="body-type text-xs text-zinc-400 leading-relaxed">
          <span className="text-zinc-500">Why: </span>
          {plan.why}
        </p>
        {plan.caveat && (
          <p className="body-type text-[11px] text-amber-400/80 mt-2 leading-relaxed">
            {plan.caveat}
          </p>
        )}
      </div>
    </div>
  );
}

export default function PlanCarousel() {
  const [i, setI] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const pausedRef = useRef(false);

  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const id = window.setInterval(() => {
      if (!pausedRef.current) setI((prev) => (prev + 1) % PLANS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className="relative mx-auto mt-14 max-w-2xl fade-up-slow"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div
        aria-hidden
        className="body-type absolute -top-2.5 right-4 z-20 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(28,28,34,0.96), rgba(16,16,20,0.96))",
          color: "#ffb47a",
          border: "1px solid rgba(255, 148, 77, 0.45)",
          boxShadow: "0 6px 18px -10px rgba(255,122,26,0.4)",
        }}
      >
        <span
          aria-hidden
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: "#ff944d",
            boxShadow: "0 0 8px rgba(255, 148, 77, 0.7)",
          }}
        />
        AI ranked
      </div>

      <div
        className="relative overflow-hidden rounded-2xl"
        aria-live="polite"
      >
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${i * 100}%)` }}
        >
          {PLANS.map((p) => (
            <div key={p.product} className="w-full shrink-0">
              <PlanCard plan={p} />
            </div>
          ))}
        </div>
      </div>

      <p className="body-type text-center mt-4 text-[11px] text-zinc-500">
        Real plans pulled from Power to Choose for the Dallas-Fort Worth area.
        Pricing as of Apr 2026.
      </p>

      <div
        className="flex justify-center gap-2 mt-3"
        role="tablist"
        aria-label="Sample plan recommendations"
      >
        {PLANS.map((p, idx) => {
          const active = idx === i;
          return (
            <button
              key={p.product}
              type="button"
              role="tab"
              aria-selected={active}
              aria-label={`Show ${p.provider} ${p.product}`}
              onClick={() => setI(idx)}
              className="group relative inline-flex items-center justify-center px-1 py-3 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ember-400/60 focus-visible:ring-offset-0"
            >
              <span
                className={`relative block h-1.5 rounded-full overflow-hidden transition-all duration-300 ${
                  active
                    ? "w-10 bg-white/15"
                    : "w-2 bg-white/15 group-hover:bg-white/30"
                }`}
              >
                {active && (
                  <span
                    key={i}
                    className="absolute inset-0 bg-ember-500 rounded-full origin-left"
                    style={{
                      animation: `dot-progress ${ROTATE_MS}ms linear forwards`,
                      animationPlayState: isPaused ? "paused" : "running",
                    }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
