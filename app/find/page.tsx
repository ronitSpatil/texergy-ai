import { ZipHero } from "@/components/find/zip-hero";

export const metadata = {
  title: "Find your plan · Texergy AI",
};

export default function FindHomePage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <ZipHero />
    </main>
  );
}
