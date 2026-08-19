"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

export function OrbisShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".showcase-fade", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 75%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10">
      <div className="mb-20 text-center showcase-fade">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#084ba7]">
          Why Orbis
        </p>
        <h2 className="mt-4 text-4xl font-medium tracking-[-0.04em] text-[#0d172a] sm:text-5xl">
          Everything your community needs. <br className="hidden sm:block" />
          In one seamless world.
        </h2>
      </div>

      <div className="flex flex-col gap-24 lg:gap-32">
        {/* Feature 1 */}
        <div className="showcase-fade grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1 relative rounded-2xl bg-[#ebf4ff] p-8 md:p-12 h-[400px] flex items-center justify-center border border-[#dfe7f3] overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#5fa3ff_0%,transparent_70%)] opacity-20" />
             <div className="relative z-10 w-full max-w-sm rounded-xl bg-white shadow-2xl p-6 border border-black/5 transform rotate-2 hover:rotate-0 transition-transform duration-500">
               <div className="h-4 w-1/3 bg-[#dfe7f3] rounded mb-4" />
               <div className="h-2 w-full bg-[#f1f5fa] rounded mb-2" />
               <div className="h-2 w-5/6 bg-[#f1f5fa] rounded mb-2" />
               <div className="h-2 w-4/6 bg-[#f1f5fa] rounded mb-6" />
               <div className="flex gap-2">
                 <div className="h-8 w-16 bg-[#d3f625] rounded-full" />
                 <div className="h-8 w-16 bg-[#ebf4ff] rounded-full" />
               </div>
             </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] bg-[#d3f625] text-[#0d172a]">
              Space Architecture
            </div>
            <h3 className="mt-6 text-3xl font-medium tracking-[-0.04em] text-[#0d172a] sm:text-4xl">
              Build worlds like living neighborhoods
            </h3>
            <p className="mt-6 text-lg leading-8 text-[#46536a]">
              Create voice plazas, private rooms, and social zones where your community naturally gathers. Design your space to match your culture, not the other way around.
            </p>
            <ul className="mt-8 space-y-4">
              {['Modular layouts for any team size', 'Custom branding and themes', 'Frictionless entry and exit'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-base text-[#2c3a4f]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ebf4ff] text-[#084ba7] text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="showcase-fade grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] bg-[#ebf4ff] text-[#084ba7]">
              Meetings & Rituals
            </div>
            <h3 className="mt-6 text-3xl font-medium tracking-[-0.04em] text-[#0d172a] sm:text-4xl">
              Schedule sessions that people actually join
            </h3>
            <p className="mt-6 text-lg leading-8 text-[#46536a]">
              From standups to townhalls, run recurring experiences with clear timing, context, and ownership.
            </p>
            <ul className="mt-8 space-y-4">
              {['One-click calendar integration', 'Persistent chat history', 'Automated meeting notes'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-base text-[#2c3a4f]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#ebf4ff] text-[#084ba7] text-xs">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-2xl bg-[#0d172a] p-8 md:p-12 h-[400px] flex items-center justify-center border border-[#1e293b] overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,#084ba7_0%,transparent_70%)] opacity-40" />
             <div className="relative z-10 w-full max-w-sm rounded-xl bg-[#111827] shadow-2xl p-6 border border-white/10 transform -rotate-2 hover:rotate-0 transition-transform duration-500 text-white">
               <div className="flex items-center justify-between mb-6">
                 <div className="h-5 w-1/2 bg-white/20 rounded" />
                 <div className="h-5 w-8 bg-[#d3f625] rounded-full" />
               </div>
               <div className="space-y-3">
                 <div className="h-12 w-full bg-white/5 rounded-lg flex items-center px-4"><div className="h-2 w-1/3 bg-white/40 rounded" /></div>
                 <div className="h-12 w-full bg-white/10 rounded-lg flex items-center px-4 border border-white/20"><div className="h-2 w-1/2 bg-[#5fa3ff] rounded" /></div>
                 <div className="h-12 w-full bg-white/5 rounded-lg flex items-center px-4"><div className="h-2 w-1/4 bg-white/40 rounded" /></div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
