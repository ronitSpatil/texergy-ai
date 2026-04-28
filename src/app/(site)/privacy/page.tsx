import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Texergy AI",
  description: "What we collect, what we don't, and how to delete it.",
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-6">
      <header className="mb-12">
        <p className="body-type text-[22px] uppercase tracking-[0.22em] text-ember-400 mb-4 font-medium">
          Privacy Policy
        </p>
        <h1 className="section-heading text-4xl sm:text-5xl text-zinc-50 tracking-tight">
          Your data, in plain English.
        </h1>
        <p className="body-type mt-4 text-sm text-zinc-500">
          Last updated: April 27, 2026
        </p>
      </header>

      <div className="body-type space-y-8 text-zinc-300 leading-relaxed">
        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            What we collect
          </h2>
          <p>
            When you join the waitlist, we store your email address and
            (optionally) your ZIP code. That's all the personal information we
            keep about you. If you contact us by email, we'll have whatever you
            wrote in that email.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            What we don't collect
          </h2>
          <ul className="list-disc list-outside ml-5 space-y-2 marker:text-ember-400/60">
            <li>
              <strong className="text-zinc-100">No unnecessary technical identifiers.</strong>{" "}
              We use limited technical signals to protect the waitlist from
              abuse, but we do not use them to profile you or market to you.
            </li>
            <li>
              <strong className="text-zinc-100">No third-party trackers.</strong>{" "}
              No Google Analytics, no Facebook pixel, no advertising cookies.
            </li>
            <li>
              <strong className="text-zinc-100">No cross-site tracking.</strong>{" "}
              We don't sell, rent, or share your information with advertisers
              or data brokers. Ever.
            </li>
            <li>
              <strong className="text-zinc-100">No payment information.</strong>{" "}
              The service is free and there's no payment flow.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            How we use what we collect
          </h2>
          <p className="mb-3">
            Your email is used for two things: (1) to confirm your spot on the
            waitlist, and (2) to email you when early access opens. If we have
            your ZIP, we'll show plan options for your service area when the
            product launches.
          </p>
          <p>
            We don't email you about anything else without asking first. No
            newsletter, no marketing blasts, no &ldquo;we miss you&rdquo;
            re-engagement.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Where it lives
          </h2>
          <p>
            Your waitlist information is stored securely and only used for the
            purposes described here. Confirmation emails may be sent through a
            trusted email delivery provider, which receives only the information
            needed to deliver those messages.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            How long we keep it
          </h2>
          <p>
            Until you ask us to delete it, or until early access launches and
            you don't activate within 12 months — whichever comes first.
            Temporary anti-abuse signals are kept only as long as needed to
            protect the service.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Deleting your data
          </h2>
          <p>
            Email{" "}
            <a
              href="mailto:hello@texergy.ai?subject=Delete%20my%20data"
              className="text-ember-300 hover:text-ember-200 underline underline-offset-2"
            >
              hello@texergy.ai
            </a>{" "}
            with the subject &ldquo;Delete my data&rdquo; from the address you
            signed up with. We'll confirm deletion within 7 days. No
            justification needed; no friction.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Children
          </h2>
          <p>
            Texergy AI is not directed at children under 13 and we don't
            knowingly collect data from them. Texas electricity contracts are
            for adult account-holders.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Changes to this policy
          </h2>
          <p>
            If we change something material — what we collect, who we share it
            with, how long we keep it — we'll email everyone on the waitlist
            and post a notice here at least 14 days before it takes effect.
          </p>
        </section>

        <section>
          <h2 className="display-type text-xl font-semibold text-zinc-100 mb-3">
            Contact
          </h2>
          <p>
            Questions about anything here:{" "}
            <a
              href="mailto:hello@texergy.ai"
              className="text-ember-300 hover:text-ember-200 underline underline-offset-2"
            >
              hello@texergy.ai
            </a>
            .
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
