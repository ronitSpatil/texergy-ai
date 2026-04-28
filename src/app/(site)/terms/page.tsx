import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Texergy AI",
  description: "The rules of using Texergy AI during early access.",
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-6">
      <header className="mb-12">
        <p className="body-type text-[22px] uppercase tracking-[0.22em] text-ember-400 mb-4 font-medium">
          Terms of Service
        </p>
        <h1 className="section-heading text-4xl sm:text-5xl text-zinc-50 tracking-tight">
          The agreement, kept short.
        </h1>
        <p className="body-type mt-4 text-sm text-zinc-500">
          Last updated: April 27, 2026
        </p>
      </header>

      <div className="body-type space-y-8 text-zinc-300 leading-relaxed">
        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            What this is
          </h2>
          <p>
            Texergy AI (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is an early-access
            tool that helps Texas residents shortlist retail electricity plans
            available in their service area. By joining the waitlist or using
            the site, you agree to these terms.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Plan recommendations are guidance, not advice
          </h2>
          <p className="mb-3">
            Plan rankings reflect our model's read of publicly-available data
            from{" "}
            <a
              href="https://www.powertochoose.org/"
              className="text-ember-300 hover:text-ember-200 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Power to Choose
            </a>
            , normalized to estimate real cost at typical usage levels. They
            are <em>not</em> personalized financial advice and don't account
            for every individual circumstance (e.g., unusual usage curves, a
            roommate paying half your bill, time-shifted EV charging).
          </p>
          <p>
            You're responsible for reading the official Electricity Facts
            Label and Terms of Service from any retail provider before
            signing up.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Acceptable use
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-2 marker:text-ember-400/60">
            <li>Don't try to bypass abuse protections, scrape the site at scale, or interfere with other users.</li>
            <li>Don't impersonate someone else when joining the waitlist.</li>
            <li>Don't reverse-engineer or attempt to defeat the site's security or anti-abuse systems.</li>
            <li>Don't use the site to send spam, abuse, or threats to anyone.</li>
          </ul>
          <p className="mt-3">
            If you do any of these, we may revoke your access without notice.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            No account required (for now)
          </h2>
          <p>
            During early access there's no login. Your only identifier is the
            email you put on the waitlist. If we add accounts later, we'll
            update these terms before that change takes effect.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            What we own, what you own
          </h2>
          <p className="mb-3">
            The site, design, code, and ranking model are ours. The email
            address (and optional ZIP) you submit are yours — you grant us a
            limited license to use them for the purposes described in our{" "}
            <a
              href="/privacy"
              className="text-ember-300 hover:text-ember-200 underline underline-offset-2"
            >
              Privacy Policy
            </a>
            .
          </p>
          <p>
            Plan data is sourced from{" "}
            <a
              href="https://www.powertochoose.org/"
              className="text-ember-300 hover:text-ember-200 underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Power to Choose
            </a>{" "}
            (Texas Public Utility Commission) and is the property of those
            sources and their respective providers.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Service is provided &ldquo;as is&rdquo;
          </h2>
          <p>
            Early access means the service is still maturing. We don't
            warranty uninterrupted availability, accuracy of every data point,
            or freedom from bugs. You use the site at your own risk.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Changes
          </h2>
          <p>
            We may update these terms as the product evolves. Material changes
            will be emailed to anyone on the waitlist at least 14 days before
            taking effect; continued use after that constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Governing law
          </h2>
          <p>
            These terms are governed by the laws of the State of Texas.
            Disputes go to the state or federal courts located in Collin
            County, Texas.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Contact
          </h2>
          <p>
            Email{" "}
            <a
              href="mailto:hello@texergy.ai"
              className="text-ember-300 hover:text-ember-200 underline underline-offset-2"
            >
              hello@texergy.ai
            </a>{" "}
            with anything you'd like to discuss.
          </p>
        </section>
      </div>

      <div className="mt-16 pt-8 border-t border-white/[0.06] text-sm text-zinc-500">
        <a href="/" className="footer-link hover:text-zinc-200">
          ← Back to home
        </a>
      </div>
    </article>
  );
}
