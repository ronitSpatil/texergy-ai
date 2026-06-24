"use client";

import { motion } from "framer-motion";
import type { Mode } from "@/components/find/wizard-types";
import { SectionLabel } from "@/components/ui/section-label";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const card = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export function ModeStep({ onSelect }: { onSelect: (mode: Mode) => void }) {
  return (
    <div className="max-w-4xl mx-auto">
      <SectionLabel className="block mb-4">Choose how to find your plan</SectionLabel>
      <h2 className="font-[family-name:var(--font-bebas)] text-foreground text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-tight mb-10">
        PICK YOUR <span className="text-accent">PATH.</span>
      </h2>

      <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
        {/* Featured: Smart Match */}
        <motion.div variants={card}>
          <PathCard
            onClick={() => onSelect("smart")}
            num="01"
            tag="Recommended"
            title="Smart Match"
            blurb="Answer a few questions, then dial in what matters to you. We rank plans against your priorities."
            bullets={["Weighted scoring across 7 factors", "Sees beyond headline rates"]}
            time="~30 sec"
            featured
          />
        </motion.div>

        {/* Row: Basic + Meter */}
        <div className="grid md:grid-cols-2 gap-4">
          <motion.div variants={card} className="flex">
            <PathCard
              onClick={() => onSelect("basic")}
              num="02"
              tag="Fast Lane"
              title="Basic Filters"
              blurb="Skip the questions. Pick rate type, term length, and green energy minimum — we show what fits."
              bullets={["Direct checkbox filters", "No weights or sliders"]}
              time="~10 sec"
            />
          </motion.div>
          <motion.div variants={card} className="flex">
            <PathCard
              onClick={() => onSelect("meter")}
              num="03"
              tag="Bring Your Data"
              title="Meter Upload"
              blurb="Drop in your Smart Meter Texas CSV and we rank plans against your real usage, not a guess."
              bullets={["Up to 13 months of readings", "No more estimating kWh"]}
              time="~1 min"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function PathCard({
  onClick,
  num,
  tag,
  title,
  blurb,
  bullets,
  time,
  featured = false,
}: {
  onClick: () => void;
  num: string;
  tag: string;
  title: string;
  blurb: string;
  bullets: string[];
  time: string;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group relative text-left overflow-hidden w-full",
        "border border-border transition-all duration-300",
        "hover:border-accent",
        featured
          ? "bg-accent-soft/40 hover:bg-accent-soft/70 p-8 md:p-10"
          : "bg-card hover:bg-accent-soft/20 p-7 flex flex-col",
      ].join(" ")}
    >
      {/* Time badge — absolute top-right so it sits at the card corner regardless of inner layout */}
      <span className="absolute top-5 right-6 font-mono text-[9px] text-muted-foreground border border-border/70 px-2 py-0.5 z-10">
        {time}
      </span>

      {/* Watermark number */}
      <span
        aria-hidden="true"
        className={[
          "absolute right-4 top-1/2 -translate-y-1/2 font-[family-name:var(--font-bebas)] leading-none",
          "select-none pointer-events-none transition-opacity duration-500",
          "text-foreground/[0.045] group-hover:text-accent/[0.10]",
          featured ? "text-[13rem] sm:text-[16rem]" : "text-[9rem] sm:text-[12rem]",
        ].join(" ")}
      >
        {num}
      </span>

      {/* Left accent reveal bar */}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-300 ease-out"
      />

      {/* Bottom-right arrow */}
      <span
        aria-hidden="true"
        className="absolute bottom-5 right-6 font-mono text-xs text-accent opacity-0 translate-x-[-4px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
      >
        →
      </span>

      <div className={featured ? "flex flex-col md:flex-row md:items-center gap-8" : "flex flex-col flex-1"}>
        <div className={featured ? "flex-1" : "flex-1"}>
          {/* Tag row */}
          <div className="flex items-center gap-2 mb-4">
            {featured ? (
              <span className="font-mono text-[8px] uppercase tracking-[0.15em] text-white bg-accent px-2 py-0.5">
                Recommended
              </span>
            ) : (
              <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent">
                {tag}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={[
              "font-[family-name:var(--font-bebas)] text-foreground tracking-tight mb-3",
              "group-hover:text-accent transition-colors duration-200",
              featured ? "text-5xl md:text-6xl" : "text-4xl",
            ].join(" ")}
          >
            {title}
          </h3>

          {/* Blurb */}
          <p className={["font-mono text-sm text-muted-foreground leading-relaxed", featured ? "" : "mb-6"].join(" ")}>
            {blurb}
          </p>
        </div>

        {/* Bullets */}
        <ul className={["space-y-2 shrink-0", featured ? "md:w-60" : "mt-auto"].join(" ")}>
          {bullets.map((b) => (
            <li key={b} className="font-mono text-xs text-foreground/70 flex items-start gap-3">
              <span className="text-accent mt-0.5 shrink-0">→</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </button>
  );
}
