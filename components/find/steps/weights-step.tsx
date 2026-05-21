"use client";

import { useMemo, useState } from "react";
import type { WeightsUI } from "@/components/find/wizard-types";
import { SectionLabel } from "@/components/ui/section-label";
import { WizardFooter } from "@/components/find/wizard-footer";
import { Input } from "@/components/ui/input";

const FACTORS: { key: keyof WeightsUI; label: string; blurb: string }[] = [
  { key: "cost",                label: "Cost",              blurb: "Lower projected monthly bill at your usage." },
  { key: "renewable",           label: "Renewable",         blurb: "Higher renewable energy content." },
  { key: "contractFlexibility", label: "Flexibility",       blurb: "Low termination fees + short contract terms." },
  { key: "rateStability",       label: "Rate preference",   blurb: "How much your preferred rate type should pull matches toward it." },
  { key: "historicalPricing",   label: "Historical pricing", blurb: "Favors plans priced below the EIA Texas residential trailing-12-month average." },
  { key: "weatherForecast",     label: "Seasonality",       blurb: "Favors Fixed plans whose term covers TX summer/winter price-spike windows; penalizes Variable plans for the same exposure." },
  { key: "billTransparency",    label: "Bill transparency", blurb: "Favors plans whose bill stays close to the advertised rate — penalizes bill credits, minimum-usage fees, and steep tier cliffs between 500/1000/2000 kWh." },
];

const BALANCED: WeightsUI = { cost: 35, renewable: 10, contractFlexibility: 10, rateStability: 15, billTransparency: 10, historicalPricing: 10, weatherForecast: 10 };

type QuizAnswers = {
  billStyle: "lowest" | "predictable" | "longterm" | null;
  contractLength: "lock" | "flexible" | "any" | null;
  renewable: "green" | "nice" | "any" | null;
  avoid: ("credits" | "swings" | "longlock")[];
  spikes: "shield" | "any" | null;
};

const EMPTY_QUIZ: QuizAnswers = {
  billStyle: null,
  contractLength: null,
  renewable: null,
  avoid: [],
  spikes: null,
};

function deriveWeights(a: QuizAnswers): WeightsUI {
  const w: WeightsUI = { ...BALANCED };
  switch (a.billStyle) {
    case "lowest":      w.cost += 20; break;
    case "predictable": w.billTransparency += 15; w.rateStability += 5; break;
    case "longterm":    w.rateStability += 15; w.weatherForecast += 10; break;
  }
  switch (a.contractLength) {
    case "lock":     w.contractFlexibility = Math.max(0, w.contractFlexibility - 5); w.rateStability += 5; break;
    case "flexible": w.contractFlexibility += 15; break;
    case "any":      w.cost += 5; break;
  }
  switch (a.renewable) {
    case "green": w.renewable += 25; break;
    case "nice":  w.renewable += 10; break;
  }
  for (const tag of a.avoid) {
    if (tag === "credits")  w.billTransparency += 10;
    if (tag === "swings")   { w.rateStability += 10; w.weatherForecast += 5; }
    if (tag === "longlock") w.contractFlexibility += 10;
  }
  if (a.spikes === "shield") w.weatherForecast += 15;
  return normalize(w);
}

function normalize(w: WeightsUI): WeightsUI {
  const total = Object.values(w).reduce((s, v) => s + v, 0);
  if (total === 0) return BALANCED;
  const scaled = (Object.keys(w) as (keyof WeightsUI)[]).reduce((acc, k) => {
    acc[k] = Math.round((w[k] / total) * 100);
    return acc;
  }, {} as WeightsUI);
  const diff = 100 - Object.values(scaled).reduce((s, v) => s + v, 0);
  scaled.cost += diff;
  return scaled;
}

function clampWeight(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, Math.round(value)));
}

export function WeightsStep({
  weights,
  onChange,
  onBack,
  onNext,
}: {
  weights: WeightsUI;
  onChange: (w: WeightsUI) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [mode, setMode] = useState<"quiz" | "sliders">("quiz");
  const [quiz, setQuiz] = useState<QuizAnswers>(EMPTY_QUIZ);
  const derived = useMemo(() => deriveWeights(quiz), [quiz]);

  function patchQuiz(p: Partial<QuizAnswers>) {
    setQuiz((q) => ({ ...q, ...p }));
  }
  function toggleAvoid(tag: QuizAnswers["avoid"][number]) {
    setQuiz((q) => ({
      ...q,
      avoid: q.avoid.includes(tag) ? q.avoid.filter((t) => t !== tag) : [...q.avoid, tag],
    }));
  }
  function commitQuizAndNext() {
    onChange(derived);
    onNext();
  }
  function switchToSliders() {
    onChange(derived);
    setMode("sliders");
  }

  if (mode === "sliders") {
    return (
      <SliderMode
        weights={weights}
        onChange={onChange}
        onBack={() => setMode("quiz")}
        onNext={onNext}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-4">
        <SectionLabel className="block">What matters to you</SectionLabel>
        <button
          type="button"
          onClick={switchToSliders}
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent transition-colors"
        >
          Customize sliders →
        </button>
      </div>
      <h2 className="font-[family-name:var(--font-bebas)] text-foreground text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight mb-2">
        FIVE QUICK <span className="text-accent">CALLS.</span>
      </h2>
      <p className="font-mono text-sm text-muted-foreground mb-10 max-w-2xl">
        Tell us what to optimize for. We weight the ranking from your answers — skip any you don&apos;t feel strongly about.
      </p>

      <div className="space-y-10">
        <QuizQ
          number="01"
          title="What matters most about your bill?"
          options={[
            { id: "lowest",      label: "Lowest total" },
            { id: "predictable", label: "Predictable, no surprises" },
            { id: "longterm",    label: "Long-term certainty" },
          ]}
          value={quiz.billStyle}
          onSelect={(v) => patchQuiz({ billStyle: v as QuizAnswers["billStyle"] })}
        />

        <QuizQ
          number="02"
          title="Contract length?"
          options={[
            { id: "lock",     label: "Lock me in" },
            { id: "flexible", label: "Keep me flexible" },
            { id: "any",      label: "Whatever's cheapest" },
          ]}
          value={quiz.contractLength}
          onSelect={(v) => patchQuiz({ contractLength: v as QuizAnswers["contractLength"] })}
        />

        <QuizQ
          number="03"
          title="How much does renewable energy matter?"
          options={[
            { id: "green", label: "100% green only" },
            { id: "nice",  label: "Nice to have" },
            { id: "any",   label: "Don't care" },
          ]}
          value={quiz.renewable}
          onSelect={(v) => patchQuiz({ renewable: v as QuizAnswers["renewable"] })}
        />

        <QuizMultiQ
          number="04"
          title="Anything you specifically want to avoid?"
          subtitle="Pick any that apply."
          options={[
            { id: "credits",  label: "Bill-credit thresholds" },
            { id: "swings",   label: "Variable rates that swing" },
            { id: "longlock", label: "Long lock-ins" },
          ]}
          values={quiz.avoid}
          onToggle={(v) => toggleAvoid(v as QuizAnswers["avoid"][number])}
        />

        <QuizQ
          number="05"
          title="Worried about TX summer or winter price spikes?"
          options={[
            { id: "shield", label: "Yes, shield me" },
            { id: "any",    label: "Not really" },
          ]}
          value={quiz.spikes}
          onSelect={(v) => patchQuiz({ spikes: v as QuizAnswers["spikes"] })}
        />
      </div>

      <DerivedPreview weights={derived} />

      <WizardFooter onBack={onBack} onNext={commitQuizAndNext} nextLabel="See matches →" />
    </div>
  );
}

function QuizQ({
  number,
  title,
  options,
  value,
  onSelect,
}: {
  number: string;
  title: string;
  options: { id: string; label: string }[];
  value: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="border-t border-border/40 pt-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent mb-3">
        {number} / {title}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => onSelect(o.id)}
            className={`border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
              value === o.id
                ? "border-accent text-accent"
                : "border-foreground/25 text-muted-foreground hover:border-foreground/50 hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizMultiQ({
  number,
  title,
  subtitle,
  options,
  values,
  onToggle,
}: {
  number: string;
  title: string;
  subtitle?: string;
  options: { id: string; label: string }[];
  values: string[];
  onToggle: (id: string) => void;
}) {
  return (
    <div className="border-t border-border/40 pt-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
        {number} / {title}
      </div>
      {subtitle && <p className="mt-1 font-mono text-xs text-muted-foreground">{subtitle}</p>}
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = values.includes(o.id);
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => onToggle(o.id)}
              className={`border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                active
                  ? "border-accent text-accent"
                  : "border-foreground/25 text-muted-foreground hover:border-foreground/50 hover:text-foreground"
              }`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DerivedPreview({ weights }: { weights: WeightsUI }) {
  const rows = (Object.keys(weights) as (keyof WeightsUI)[]).map((k) => ({
    key: k,
    label: FACTORS.find((f) => f.key === k)?.label ?? k,
    value: weights[k],
  }));
  rows.sort((a, b) => b.value - a.value);
  return (
    <div className="mt-12 border-t border-border/40 pt-6">
      <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
        Your derived weights
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center gap-3">
            <div className="flex-1 font-mono text-xs text-foreground">{r.label}</div>
            <div className="h-1.5 flex-[2] bg-foreground/10">
              <div className="h-full bg-accent" style={{ width: `${Math.min(100, r.value * 2)}%` }} />
            </div>
            <div className="w-10 text-right font-mono text-[11px] tabular-nums text-muted-foreground">
              {r.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SliderMode({
  weights,
  onChange,
  onBack,
  onNext,
}: {
  weights: WeightsUI;
  onChange: (w: WeightsUI) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-4">
        <SectionLabel className="block">Customize weights</SectionLabel>
        <button
          type="button"
          onClick={onBack}
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground hover:text-accent transition-colors"
        >
          ← Back to quiz
        </button>
      </div>
      <h2 className="font-[family-name:var(--font-bebas)] text-foreground text-[clamp(2.5rem,5vw,4rem)] leading-[0.95] tracking-tight mb-2">
        DIAL IT <span className="text-accent">IN.</span>
      </h2>
      <p className="font-mono text-sm text-muted-foreground mb-6 max-w-2xl">
        Move each slider yourself. We normalize the values so total weight always sums to 1.
      </p>

      <div className="space-y-8">
        {FACTORS.map((f) => (
          <div key={f.key} className="border-t border-border/40 pt-6">
            <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
                  {f.label}
                </div>
                <p className="mt-2 max-w-xl font-mono text-xs text-muted-foreground">{f.blurb}</p>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-center">
                <label htmlFor={`weight-${f.key}`} className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Weight
                </label>
                <Input
                  id={`weight-${f.key}`}
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  inputMode="numeric"
                  value={weights[f.key]}
                  onChange={(e) =>
                    onChange({ ...weights, [f.key]: clampWeight(e.target.valueAsNumber) })
                  }
                  className="h-9 w-20 border-foreground/25 bg-background/60 px-2 text-center font-mono text-sm tabular-nums"
                  aria-label={`${f.label} weight`}
                />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={weights[f.key]}
              onChange={(e) => onChange({ ...weights, [f.key]: parseInt(e.target.value, 10) })}
              className="w-full accent-accent"
            />
          </div>
        ))}
      </div>

      <WizardFooter onBack={onBack} onNext={onNext} nextLabel="See matches →" />
    </div>
  );
}
