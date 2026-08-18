"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAppAuth } from "@/components/providers/AppAuthProvider";
import authStore from "@/store/authStore";

export function OrbisHeader() {
  const { user, isAuthenticated } = useAppAuth();
  const logout = authStore((state) => state.logout);
  const [menuOpen, setMenuOpen] = useState(false);
  const firstName = user?.fullName?.trim().split(/\s+/)[0] ?? "Orbit";

  const handleLogout = async () => {
    try {
      await logout();
      setMenuOpen(false);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <header className="relative z-50 mx-auto max-w-7xl px-5 pb-4 pt-6 sm:px-8 lg:px-10">
      <div className="flex items-center justify-between rounded-full border border-[#dfe7f3] bg-white/80 px-5 py-3 shadow-[0_10px_30px_rgba(8,75,167,0.05)] backdrop-blur-sm">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Orbis logo"
            width={110}
            height={38}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-[#2c3a4f] md:flex">
          <Link href="/#platform" className="transition hover:text-[#084ba7]">
            Platform
          </Link>
          <Link href="/#community" className="transition hover:text-[#084ba7]">
            Community
          </Link>
          <Link href="/#experience" className="transition hover:text-[#084ba7]">
            Experience
          </Link>
        </nav>

        {isAuthenticated ? (
          <div className="relative z-50">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#dfe7f3] bg-[#ebf4ff] px-4 py-2 text-sm font-medium text-[#084ba7] transition hover:border-[#084ba7]/25 hover:bg-[#e5f1ff]"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#d3f625] shadow-[0_0_12px_rgba(211,246,37,0.8)]" />
              Hi, {firstName}
            </button>

            {menuOpen && (
              <div className="pointer-events-auto absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-2xl border border-[#dfe7f3] bg-white/95 p-1 shadow-[0_20px_50px_rgba(8,75,167,0.12)] backdrop-blur-md">
                <Link
                  href="/orbit"
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-[#0d172a] transition hover:bg-[#eef6ff] hover:text-[#084ba7]"
                >
                  Orbit
                </Link>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleLogout();
                  }}
                  className="block w-full cursor-pointer rounded-xl px-3 py-2 text-left text-sm font-medium text-[#0d172a] transition hover:bg-[#fdecec] hover:text-[#b42318]"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth"
            className="rounded-full border border-[#084ba7]/20 bg-[#084ba7] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#063c8f]"
          >
            Get started
          </Link>
        )}
      </div>
    </header>
  );
}
