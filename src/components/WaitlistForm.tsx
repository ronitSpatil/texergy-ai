"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, zip, website }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list. We'll be in touch soon.");
      setEmail("");
      setZip("");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-label="Join the Texergy AI waitlist"
      className="w-full max-w-xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          maxLength={254}
          className="input body-type flex-1 rounded-xl px-4 py-3 text-base"
          aria-label="Email address"
        />
        <input
          type="text"
          name="zip"
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          placeholder="ZIP (optional)"
          value={zip}
          onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))}
          className="input body-type rounded-xl px-4 py-3 text-base sm:w-36"
          aria-label="ZIP code (optional)"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-primary body-type rounded-xl px-6 py-3 text-base whitespace-nowrap"
        >
          {status === "submitting" ? "Joining…" : "Join waitlist"}
        </button>
      </div>

      {/* Honeypot — hidden from users, attractive to naive bots */}
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
      </div>

      <div
        role="status"
        aria-live="polite"
        className="body-type min-h-6 mt-3 text-sm text-center"
      >
        {message && (
          <span
            className={
              status === "success" ? "text-ember-300" : "text-red-400"
            }
          >
            {message}
          </span>
        )}
      </div>

      <p className="body-type text-xs text-center text-zinc-500 mt-2">
        We'll only email you about Texergy AI. No spam, unsubscribe anytime.
      </p>
    </form>
  );
}
