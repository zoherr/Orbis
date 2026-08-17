"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    eyebrow: "1. Create",
    title: "Build your own orbit",
    body: "Design spaces, rooms, and vibes that feel like home for your people.",
    color: "bg-[#d3f625] text-[#0d172a]",
  },
  {
    eyebrow: "2. Connect",
    title: "Turn communities into rituals",
    body: "Chat, hang out, and stay close with events, channels, and shared moments.",
    color: "bg-[#ebf4ff] text-[#084ba7]",
  },
  {
    eyebrow: "3. Grow",
    title: "Let your world evolve",
    body: "Create identity-rich experiences that keep your people coming back.",
    color: "bg-[#084ba7] text-white",
  },
];

export function OrbisShowcase() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      gsap.from(".showcase-card", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 80%",
        },
      });
    }, ref);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10">
      <div className="mb-12 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-[#084ba7]">
          built for connection
        </p>
        <h2 className="mt-4 text-4xl font-medium tracking-[-0.05em] text-[#0d172a] sm:text-5xl">
          A digital world made for people.
        </h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {features.map((feature) => (
          <article
            key={feature.title}
            className="showcase-card rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_20px_60px_rgba(8,75,167,0.06)]"
          >
            <div
              className={`inline-flex rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] ${feature.color}`}
            >
              {feature.eyebrow}
            </div>
            <h3 className="mt-6 text-2xl font-medium tracking-[-0.04em] text-[#0d172a]">
              {feature.title}
            </h3>
            <p className="mt-4 text-base leading-7 text-[#46536a]">
              {feature.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
