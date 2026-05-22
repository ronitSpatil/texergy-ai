export type Step = { label: string; active: boolean; done: boolean };

export function ProgressBar({ steps }: { steps: Readonly<Step[]> }) {
  return (
    // Responsive sizing: show full labels but use smaller font and tighter
    // tracking on mobile so all 4 steps fit. Connectors are short dashes on
    // mobile, longer lines on larger screens.
    <ol
      className="flex items-center justify-center gap-1.5 sm:gap-3 w-fit mx-auto"
      aria-label="Progress"
    >
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-1.5 sm:gap-3">
          <span
            className={[
              "font-mono text-[8px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.3em] whitespace-nowrap",
              step.active
                ? "text-accent"
                : step.done
                  ? "text-foreground"
                  : "text-muted-foreground",
            ].join(" ")}
          >
            {String(i + 1).padStart(2, "0")} / {step.label}
          </span>
          {i < steps.length - 1 && (
            <div
              className={[
                "w-3 sm:w-8 md:w-16 h-px shrink-0",
                step.done ? "bg-foreground/60" : "bg-border/60",
              ].join(" ")}
              aria-hidden="true"
            />
          )}
        </li>
      ))}
    </ol>
  );
}
