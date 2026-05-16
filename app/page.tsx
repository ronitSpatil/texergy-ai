import { redirect } from "next/navigation";
import { HeroSection } from "@/components/hero-section";
import { SignalsSection } from "@/components/signals-section";
import { WorkSection } from "@/components/work-section";
import { PrinciplesSection } from "@/components/principles-section";
import { WaitlistSection } from "@/components/waitlist-section";
import { FaqSection } from "@/components/faq-section";
import { ColophonSection } from "@/components/colophon-section";
import { SideNav } from "@/components/side-nav";

// Dev-only routing flag: when set to "product" (typically only in the product
// worktree's .env.local), root `/` jumps straight to the in-development product
// instead of rendering the waitlist landing. Leave UNSET in Vercel production
// so visitors to texergy.ai always see the waitlist landing.
const APP_MODE = process.env.NEXT_PUBLIC_APP_MODE;

export default function Page() {
  if (APP_MODE === "product") {
    redirect("/find");
  }
  return (
    <main id="top" className="relative min-h-screen overflow-x-clip">
      <SideNav />
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />

      <div className="relative z-10">
        <HeroSection />
        <SignalsSection />
        <WorkSection />
        <PrinciplesSection />
        <WaitlistSection />
        <FaqSection />
        <ColophonSection />
      </div>
    </main>
  );
}
