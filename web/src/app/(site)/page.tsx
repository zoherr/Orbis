import { OrbisFooter } from "@/components/orbis-footer";
import { OrbisHero } from "@/components/orbis-hero";
import { OrbisShowcase } from "@/components/orbis-showcase";

export default function HomePage() {
  return (
    <main className="bg-[#f7f7f4] text-[#0d172a]">
      <OrbisHero />
      <OrbisShowcase />
      <OrbisFooter />
    </main>
  );
}
