import FloatingNav from "@/components/FloatingNav";
import ScrollReveal from "@/components/ScrollReveal";
import SiteFooter from "@/components/SiteFooter";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="relative min-h-screen overflow-x-clip">
      <FloatingNav />
      <ScrollReveal />

      {/* Background layers — same texture as home */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-fiber" />
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 bg-noise" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      <div className="relative pt-32 sm:pt-40 pb-20 fade-up">{children}</div>

      <SiteFooter />
    </main>
  );
}
