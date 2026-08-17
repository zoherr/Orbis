import type { ReactNode } from "react";
import { OrbisHeader } from "@/components/orbis-header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f7f4] text-[#0d172a]">
      <OrbisHeader />
      {children}
    </div>
  );
}
