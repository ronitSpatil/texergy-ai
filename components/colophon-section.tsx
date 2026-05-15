"use client"

import { useRef, useEffect } from "react"
import { SectionLabel } from "@/components/ui/section-label"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ColophonSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Grid columns fade up with stagger
      if (gridRef.current) {
        const columns = gridRef.current.querySelectorAll(":scope > div")
        gsap.from(columns, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Footer fade in
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="colophon"
      className="relative pt-32 pb-10 md:pb-12 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <SectionLabel>07 / Coming soon</SectionLabel>
        <h2 className="mt-4 font-[var(--font-bebas)] text-5xl md:text-7xl tracking-tight">TEXERGY AI</h2>
      </div>

      {/* Multi-column layout */}
      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">

        {/* Product */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Product</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">How It Works</li>
            <li className="font-mono text-xs text-foreground/80">Early Access</li>
            <li className="font-mono text-xs text-foreground/80">FAQ</li>
          </ul>
        </div>

        {/* Company */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Company</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80">About Texergy AI</li>
            <li className="font-mono text-xs text-foreground/80 flex items-center gap-1.5">
              Blog
              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wide">Soon</span>
            </li>
            <li className="font-mono text-xs text-foreground/80 flex items-center gap-1.5">
              Press
              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wide">Soon</span>
            </li>
            <li className="font-mono text-xs text-foreground/80">Partner With Us</li>
          </ul>
        </div>

        {/* Resources */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="https://www.powertochoose.org" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200">
                Power to Choose
              </a>
            </li>
            <li>
              <a href="https://www.puc.texas.gov" target="_blank" rel="noopener noreferrer" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200">
                PUC of Texas
              </a>
            </li>
            <li className="font-mono text-xs text-foreground/80 flex items-center gap-1.5">
              Energy Usage Calculator
              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wide">Soon</span>
            </li>
            <li className="font-mono text-xs text-foreground/80 flex items-center gap-1.5">
              Texas Energy 101
              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wide">Soon</span>
            </li>
            <li className="font-mono text-xs text-foreground/80 flex items-center gap-1.5">
              Glossary
              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wide">Soon</span>
            </li>
          </ul>
        </div>

        {/* Plans */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Plans</h4>
          <ul className="space-y-2">
            <li className="font-mono text-xs text-foreground/80 flex items-center gap-1.5">
              Residential Plans
              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wide">Soon</span>
            </li>
            <li className="font-mono text-xs text-foreground/80 flex items-center gap-1.5">
              Commercial Plans
              <span className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-wide">Soon</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Contact</h4>
          <ul className="space-y-2">
            <li>
              <a href="mailto:hello@texergy.ai" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200">
                hello@texergy.ai
              </a>
            </li>
            <li>
              <a href="mailto:ronit@texergy.ai" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200">
                ronit@texergy.ai
              </a>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="col-span-1">
          <h4 className="font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a href="/terms" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="/privacy" className="font-mono text-xs text-foreground/80 hover:text-accent transition-colors duration-200">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom copyright */}
      <div
        ref={footerRef}
        className="mt-24 pt-8 border-t border-border/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
          © 2026 Texergy AI. All rights reserved.
        </p>
        <p className="font-mono text-[10px] text-muted-foreground">
          Built to make Texas electricity shopping clearer.
        </p>
      </div>
    </section>
  )
}
