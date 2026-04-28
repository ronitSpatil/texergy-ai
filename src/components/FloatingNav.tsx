"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { hash: "#how", label: "How it works" },
  { hash: "#why", label: "Why Texergy" },
  { hash: "#faq", label: "FAQ" },
  { hash: "#contact", label: "Contact" },
];

export default function FloatingNav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Brand: on home → smooth-scroll to top, clear hash. On any sub-page → go home.
  const onBrandClick = () => {
    if (isHome) {
      if (window.location.hash) {
        history.replaceState(
          null,
          "",
          window.location.pathname + window.location.search,
        );
      }
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  // Section anchors: on home → in-page hash; elsewhere → /#hash to land on home and scroll.
  const linkHref = (hash: string) => (isHome ? hash : `/${hash}`);
  const ctaHref = isHome ? "#waitlist" : "/#waitlist";

  return (
    <div
      className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        scrolled ? "top-4" : "top-6"
      }`}
    >
      <nav
        aria-label="Primary"
        className={`nav-floating flex items-center gap-2 rounded-full pl-5 pr-2 py-2 transition-all duration-300 ${
          scrolled ? "scale-[0.98]" : "scale-100"
        }`}
      >
        <button
          type="button"
          onClick={onBrandClick}
          aria-label={isHome ? "Back to top" : "Texergy AI home"}
          className="flex items-center pr-4 mr-1 border-r border-white/10 cursor-pointer"
        >
          <span className="display-type brand-gradient text-[16px] font-semibold tracking-tight whitespace-nowrap">
            Texergy AI
          </span>
        </button>

        <ul className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <li key={l.hash}>
              <a
                href={linkHref(l.hash)}
                className="nav-link rounded-full px-4 py-2 text-[14px] font-medium"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href={ctaHref}
          className="btn-primary ml-2 rounded-full px-5 py-2.5 text-[14px] whitespace-nowrap"
        >
          Join waitlist
        </a>
      </nav>
    </div>
  );
}
