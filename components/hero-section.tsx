"use client"

import { useEffect, useRef } from "react"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { HeroZipForm } from "@/components/hero-zip-form"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    // Gate the scroll-fade to desktop. On mobile, focusing the ZIP input makes
    // the browser scroll up to clear the keyboard, which would otherwise drive
    // this scrub and dim the hero mid-typing.
    const mm = gsap.matchMedia()
    mm.add("(min-width: 768px)", () => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12 pt-16 md:pt-20 pb-12">
      <AnimatedNoise opacity={0.03} />

      <div ref={contentRef} className="flex-1 w-full">
        <SplitFlapAudioProvider>
          <div className="relative">
            <div className="flex justify-center md:block">
              <SplitFlapText text="TEXERGYAI" speed={80} accentIndices={[7, 8]} />
            </div>
            <div className="mt-4">
              <SplitFlapMuteToggle />
            </div>
          </div>
        </SplitFlapAudioProvider>

        <h2 className="font-sans font-medium text-foreground/70 text-[clamp(1.05rem,2.6vw,1.85rem)] mt-5 tracking-tight leading-snug max-w-2xl">
          Stop Overpaying for Electricity. Start Shopping Smarter with AI.
        </h2>

        <p className="mt-12 max-w-xl font-mono text-[14px] sm:text-[16px] text-muted-foreground leading-relaxed">
          <span className="block">
            Enter your ZIP code, share what matters to you, and Texergy AI finds the best electricity plans for residents and businesses alike.
          </span>
          <span className="mt-3 block">
            100% free + no sign up required.
          </span>
        </p>

        <div className="flex flex-wrap items-center gap-8 mt-8 justify-center">
          <HeroZipForm />
        </div>
      </div>
    </section>
  )
}
