type Props = { /** True when rendered on the home page so anchor links stay in-page */
  homePage?: boolean;
};

export default function SiteFooter({ homePage = false }: Props) {
  // From a sub-page, anchor links must include "/" so they land on home and scroll.
  const a = (hash: string) => (homePage ? hash : `/${hash}`);

  return (
    <footer className="border-t border-white/[0.06] relative">
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-14 sm:pt-10 sm:pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_1.35fr]">
          <div className="max-w-sm">
            <div className="flex items-center">
              <p className="display-type brand-gradient text-2xl font-semibold tracking-tight whitespace-nowrap">
                Texergy AI
              </p>
            </div>

            <p className="mt-5 text-sm leading-7 text-zinc-400">
              A focused Texas electricity helper that reads the fine print, ranks plans by fit,
              and keeps the experience clear from the first ZIP code to the final recommendation.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={a("#waitlist")}
                className="btn-ghost rounded-full px-4 py-2 text-sm"
              >
                Join waitlist
              </a>
              <a
                href="mailto:hello@texergy.ai"
                className="btn-ghost rounded-full px-4 py-2 text-sm"
              >
                hello@texergy.ai
              </a>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">
                Product
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                <li><a href={a("#waitlist")} className="footer-link">Waitlist</a></li>
                <li><a href={a("#how")} className="footer-link">How it works</a></li>
                <li><a href={a("#why")} className="footer-link">Why Texergy</a></li>
                <li><a href={a("#faq")} className="footer-link">FAQ</a></li>
                <li><a href={a("#contact")} className="footer-link">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">
                Company
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                <li><a href="mailto:hello@texergy.ai" className="footer-link">hello@texergy.ai</a></li>
                <li><span className="footer-muted">Dallas, Texas</span></li>
                <li><a href="/blog" className="footer-link">Blog</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-200">
                Legal
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-zinc-400">
                <li><a href="/privacy" className="footer-link">Privacy Policy</a></li>
                <li><a href="/terms" className="footer-link">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
