"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const stats = [
  { label: "Spaces live", value: "12k+" },
  { label: "Creators online", value: "8.4k" },
  { label: "Avg. sessions", value: "24 min" },
];

export function OrbisHero() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".gsap-hero-item", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.12,
      });

      gsap.to(".hero-orbit-ring", {
        rotation: 6,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".hero-float", {
        y: -10,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-8 lg:px-10"
    >
      <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(circle_at_top,#edf5ff_0%,#f7f7f4_52%,#f7f7f4_100%)]" />

      <div className="grid items-center gap-12 pb-8 pt-8 lg:grid-cols-[1.08fr_0.92fr] lg:pt-16">
        <div className="relative">
          <div className="gsap-hero-item mb-5 inline-flex items-center gap-2 rounded-full border border-[#5fa3ff]/35 bg-[#ebf4ff] px-3 py-1.5 text-xs font-medium tracking-[0.18em] text-[#084ba7] uppercase">
            <span className="h-2 w-2 rounded-full bg-[#d3f625] shadow-[0_0_12px_rgba(211,246,37,0.8)]" />
            social space platform
          </div>

          <h1 className="gsap-hero-item max-w-[750px] text-[clamp(3.5rem,7vw,8rem)] font-medium leading-[0.8] tracking-[-0.06em] text-[#0d172a]">
            <span className="block text-[0.65em]">Create Your Space.</span>
            <span className="mt-5 block text-[0.9em] text-[#084ba7] italic" style={{ fontFamily: '"FC Fast", sans-serif' }}>
              Find Your Orbit.
            </span>
          </h1>

          <p className="gsap-hero-item mt-8 max-w-xl text-xl leading-8 text-[#46536a] sm:text-2xl">
            Build your digital home, gather your people, and move through shared
            experiences in a space that feels expressive, human, and alive.
          </p>

          <div className="gsap-hero-item mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="#"
              className="rounded-full bg-[#d3f625] px-6 py-3.5 text-center text-sm font-semibold text-[#0d172a] shadow-[0_18px_36px_rgba(211,246,37,0.35)] transition hover:translate-y-[-1px] hover:bg-[#defd5f]"
            >
              Start building
            </a>
            <a
              href="#experience"
              className="rounded-full border border-[#0d172a]/10 bg-white px-6 py-3.5 text-center text-sm font-semibold text-[#0d172a] transition hover:border-[#084ba7]/30 hover:text-[#084ba7]"
            >
              Explore spaces
            </a>
          </div>

          <div className="gsap-hero-item mt-10 grid max-w-lg gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[#dfe7f3] bg-white/85 p-4 shadow-[0_10px_30px_rgba(8,75,167,0.05)]"
              >
                <div className="text-2xl font-semibold text-[#0d172a]">
                  {stat.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#5b697d]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div id="experience" className="relative">
          <div className="hero-float relative mx-auto aspect-[0.9] w-full max-w-[560px] overflow-hidden rounded-[2rem] border border-[#dfe7f3] bg-[radial-gradient(circle_at_top,#eaf4ff_0%,#f9fbff_34%,#edf1f6_100%)] p-5 shadow-[0_28px_80px_rgba(8,75,167,0.12)]">
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-[#5fa3ff]/18 blur-3xl" />
            <div className="absolute -right-10 bottom-12 h-44 w-44 rounded-full bg-[#d3f625]/22 blur-3xl" />

            <div className="relative flex h-full flex-col justify-between rounded-[1.5rem] border border-white/70 bg-white/40 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="rounded-full border border-[#dfe7f3] bg-white/70 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[#084ba7]">
                  Orbit Live
                </div>
                <div className="flex -space-x-2">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[10px] font-semibold ${
                        index === 0
                          ? "bg-[#d3f625] text-[#0d172a]"
                          : index === 1
                            ? "bg-[#5fa3ff] text-white"
                            : "bg-[#084ba7] text-white"
                      }`}
                    >
                      {index === 0 ? "A" : index === 1 ? "M" : "J"}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative flex flex-1 items-center justify-center py-4">
                <div className="hero-orbit-ring absolute h-56 w-56 rounded-full border border-[#084ba7]/15" />
                <div className="hero-orbit-ring absolute h-72 w-72 rounded-full border border-dashed border-[#5fa3ff]/50" />
                <div className="hero-orbit-ring absolute h-96 w-96 rounded-full border border-[#d3f625]/40" />

                <div className="absolute left-8 top-8 rounded-2xl border border-[#dfe7f3] bg-white/90 p-3 shadow-lg">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#5b697d]">
                    Crew chat
                  </div>
                  <div className="mt-2 text-sm font-semibold text-[#0d172a]">
                    Launch planning
                  </div>
                </div>

                <div className="absolute right-6 top-20 rounded-2xl bg-[#d3f625] px-3 py-2 text-sm font-semibold text-[#0d172a] shadow-lg">
                  +18 new vibes
                </div>

                <div className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full bg-[radial-gradient(circle_at_center,#5fa3ff_0%,#084ba7_58%,#072d66_100%)] text-center text-white shadow-[0_25px_60px_rgba(8,75,167,0.45)]">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#dfeafc]">
                      Launch
                    </div>
                    <div className="mt-1 text-2xl font-semibold">Orb</div>
                  </div>
                </div>

                <div className="absolute bottom-8 left-12 rounded-2xl border border-[#dfe7f3] bg-white/90 p-3 shadow-md">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#5b697d]">
                    Week mood
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#0d172a]">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#d3f625]" />
                    Creative flow
                  </div>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between rounded-2xl border border-[#dfe7f3] bg-white/80 px-4 py-3 shadow-[0_10px_25px_rgba(7,45,102,0.06)]">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.16em] text-[#5b697d]">
                    Active orbit
                  </div>
                  <div className="mt-1 text-lg font-semibold text-[#0d172a]">
                    Design Circle
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-full bg-[#eef6ff] px-3 py-1.5 text-xs font-medium text-[#084ba7]">
                  <span className="h-2 w-2 rounded-full bg-[#5fa3ff]" />
                  132 online
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
