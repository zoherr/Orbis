"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

interface AuthShellProps {
  eyebrow: string;
  title: ReactNode;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthShell({ eyebrow, title, subtitle, footer, children }: AuthShellProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".gsap-auth-item", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      });

      gsap.to(".auth-orbit-ring", {
        rotation: 6,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-hidden bg-[#0d172a]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url(/images/login.gif)" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(8,75,167,0.35),transparent_55%),radial-gradient(circle_at_80%_75%,rgba(211,246,37,0.14),transparent_50%),linear-gradient(180deg,rgba(13,23,42,0.35)_0%,rgba(13,23,42,0.85)_100%)]" />

      <div className="relative z-10 grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-between p-12 lg:flex">
          <Link href="/" className="gsap-auth-item inline-flex w-fit items-center gap-3 rounded-full border border-white/15 bg-white/5 px-3 py-2 backdrop-blur-sm">
            
            <Image
              src="/logo.png"
              alt="Orbis logo"
              width={110}
              height={34}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="gsap-auth-item max-w-md">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.18em] text-[#dfeafc] backdrop-blur-sm">
              social space platform
            </div>
            <h2 className="text-[clamp(2.4rem,3.6vw,3.4rem)] font-medium leading-[0.95] tracking-[-0.04em] text-white">
              Every orbit
              <span className="mt-2 block italic text-[#d3f625]" style={{ fontFamily: '"FC Fast", sans-serif' }}>
                needs a home base.
              </span>
            </h2>
            <p className="mt-5 text-base leading-7 text-[#c4cfe0]">
              Sign in to drop back into your spaces, or create an account and claim your first orbit in under a minute.
            </p>
          </div>

          <p className="gsap-auth-item text-xs text-[#8a96ab]">
            © {new Date().getFullYear()} Orbis. Built for people who build spaces.
          </p>
        </div>

        <div className="flex items-center justify-center p-5 sm:p-10">
          <div className="gsap-auth-item relative w-full max-w-md">
            <div className="auth-orbit-ring pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 sm:block" />
            <div className="auth-orbit-ring pointer-events-none absolute left-1/2 top-1/2 -z-10 hidden h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#5fa3ff]/25 sm:block" />

            <div className="rounded-[1.75rem] border border-white/15 bg-white/95 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-9">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#ebf4ff] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-[#084ba7]">
                {eyebrow}
              </div>
              <h1 className="text-[1.9rem] font-medium leading-tight tracking-[-0.03em] text-[#0d172a]">
                {title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-[#5b697d]">{subtitle}</p>

              <div className="mt-7">{children}</div>

              {footer && <div className="mt-6 text-center text-sm text-[#5b697d]">{footer}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
