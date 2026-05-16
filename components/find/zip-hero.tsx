"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SectionLabel } from "@/components/ui/section-label";

export function ZipHero() {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError("Please enter a 5-digit ZIP.");
      return;
    }
    setError(null);
    router.push(`/find/recommend?zip=${zip}`);
  }

  return (
    <section className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12">
      <div className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          TEXAS · ERCOT
        </span>
      </div>

      <div className="flex-1 w-full max-w-3xl">
        <SectionLabel className="block mb-6">01 / Start Here</SectionLabel>

        <h1 className="font-[family-name:var(--font-bebas)] text-foreground text-[clamp(3rem,9vw,7rem)] leading-[0.95] tracking-tight">
          FIND YOUR<br />
          <span className="text-accent">FAIR</span> PLAN.
        </h1>

        <p className="mt-8 max-w-xl font-mono text-[15px] text-muted-foreground leading-relaxed">
          Enter your ZIP. We&apos;ll find the electricity plans actually
          available in your service area and rank them on what matters to{" "}
          <span className="text-foreground">you</span> — not on whoever&apos;s
          paying for the loudest headline rate.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-12 flex flex-col sm:flex-row gap-3 max-w-md"
          noValidate
          aria-label="Enter your ZIP code"
        >
          <label className="sr-only" htmlFor="zip-input">
            ZIP code
          </label>
          <input
            id="zip-input"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder="75201"
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
              if (error) setError(null);
            }}
            className="flex-1 bg-transparent border border-foreground/25 px-5 py-4 font-mono text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
            aria-invalid={error != null}
          />
          <button
            type="submit"
            className="border border-foreground/25 bg-foreground text-background px-7 py-4 font-mono text-sm uppercase tracking-widest hover:bg-accent hover:text-accent-foreground hover:border-accent transition-colors"
          >
            Find plans →
          </button>
        </form>

        {error ? (
          <p className="mt-3 font-mono text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : (
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            100% free · No sign-up required · We don&apos;t sell your data
          </p>
        )}
      </div>
    </section>
  );
}
