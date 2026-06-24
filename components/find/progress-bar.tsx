export type Step = { label: string; active: boolean; done: boolean };

export function ProgressBar({ steps }: { steps: Readonly<Step[]> }) {
  const total = steps.length;
  // The active step is "where you are." Anchor the fill + logo there. Fall back
  // to the last completed step if nothing is marked active.
  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.active) !== -1
      ? steps.findIndex((s) => s.active)
      : steps.filter((s) => s.done).length,
  );
  // Position of each node (and the fill edge) along the track, 0–100%.
  const pct = total > 1 ? (activeIndex / (total - 1)) * 100 : 0;

  return (
    <div
      className="mx-auto w-full max-w-xl"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={activeIndex + 1}
      aria-valuetext={`Step ${activeIndex + 1} of ${total}: ${steps[activeIndex]?.label ?? ""}`}
    >
      {/* Track. Horizontal padding leaves room so the logo badge never clips
          at the 0%/100% extremes; vertical padding gives the badge room to
          extend above/below the track without being clipped by the header. */}
      <div className="relative px-3.5 py-3">
        <div className="relative h-1.5 rounded-full bg-border/60">
          {/* Filled portion up to the current step. */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />

          {/* Step nodes sitting on the track. The outer circle stays defined
              (a ring) at every stage; once reached, an inner dot fills the
              majority of the radius rather than the whole circle. */}
          {steps.map((step, i) => {
            const nodePct = total > 1 ? (i / (total - 1)) * 100 : 0;
            const reached = step.done || step.active;
            return (
              <span
                key={step.label}
                aria-hidden="true"
                className={[
                  "absolute top-1/2 flex size-3.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background transition-colors duration-300",
                  reached ? "border-accent" : "border-border",
                ].join(" ")}
                style={{ left: `${nodePct}%` }}
              >
                {reached && <span className="size-2.5 rounded-full bg-accent" />}
              </span>
            );
          })}

          {/* The logo badge rides the fill edge to mark current progress. */}
          <span
            aria-hidden="true"
            className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-500 ease-out"
            style={{ left: `${pct}%` }}
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.18)]">
              <img src="/logo.svg" alt="" className="size-[15px]" />
            </span>
          </span>
        </div>

        {/* Labels aligned under each node. First/last clamp to the edges so they
            don't overflow the track. */}
        <div className="relative mt-3 h-3">
          {steps.map((step, i) => {
            const nodePct = total > 1 ? (i / (total - 1)) * 100 : 0;
            const isFirst = i === 0;
            const isLast = i === total - 1;
            return (
              <span
                key={step.label}
                className={[
                  "absolute font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.25em] whitespace-nowrap transition-colors",
                  step.active
                    ? "text-accent"
                    : step.done
                      ? "text-foreground"
                      : "text-muted-foreground",
                  isFirst ? "left-0" : isLast ? "right-0" : "-translate-x-1/2",
                ].join(" ")}
                style={isFirst || isLast ? undefined : { left: `${nodePct}%` }}
              >
                {step.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
