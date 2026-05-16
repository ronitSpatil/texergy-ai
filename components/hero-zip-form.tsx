"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BitmapChevron } from "@/components/bitmap-chevron";
import { ScrambleTextOnHover } from "@/components/scramble-text";

/** ZIP entry that replaces the "Join Waitlist" CTA on the hero when the site
 *  is built in product mode. Submitting takes the user straight into the
 *  recommendation wizard with the ZIP pre-filled. Styling intentionally
 *  mirrors the original CTA so the hero composition doesn't shift. */
export function HeroZipForm() {
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
    <form onSubmit={onSubmit} noValidate aria-label="Enter your ZIP code" className="flex flex-col gap-3">
      <div className="flex items-stretch gap-3">
        <label htmlFor="hero-zip-input" className="sr-only">
          ZIP code
        </label>
        <input
          id="hero-zip-input"
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          placeholder="ZIP"
          value={zip}
          onChange={(e) => {
            setZip(e.target.value.replace(/\D/g, "").slice(0, 5));
            if (error) setError(null);
          }}
          aria-invalid={error != null}
          className="w-32 bg-transparent border border-foreground/20 px-4 py-3.5 font-mono text-sm tracking-widest uppercase text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          className="group inline-flex items-center gap-3 border border-foreground/20 px-7 py-3.5 font-mono text-sm uppercase tracking-widest text-foreground hover:border-accent hover:text-accent transition-all duration-200"
        >
          <ScrambleTextOnHover text="Find My Plan" as="span" duration={0.6} />
          <BitmapChevron className="transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
        </button>
      </div>
      {error && (
        <span className="font-mono text-xs text-destructive" role="alert">
          {error}
        </span>
      )}
    </form>
  );
}
