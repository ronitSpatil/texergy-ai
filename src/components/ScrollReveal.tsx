"use client";

import { useEffect } from "react";

/**
 * Mounts a single IntersectionObserver that toggles `.reveal-in` on every
 * element with class `reveal` once it enters the viewport (then unobserves).
 * Drop a single <ScrollReveal /> at the top of any page; sprinkle the
 * `reveal` class wherever you want a fade-up-on-scroll.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Reduced-motion users: just show everything immediately.
      document
        .querySelectorAll(".reveal")
        .forEach((el) => el.classList.add("reveal-in"));
      return;
    }

    const targets = document.querySelectorAll(".reveal:not(.reveal-in)");
    if (!targets.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-in");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((t) => obs.observe(t));

    return () => obs.disconnect();
  }, []);

  return null;
}
