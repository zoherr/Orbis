import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f7f7f4] text-[#0d172a]">
      <div
        className="pointer-events-none absolute inset-0 opacity-80"
        aria-hidden
        style={{
          background:
            "radial-gradient(circle at 14% 22%, rgba(95,163,255,0.24), transparent 46%), radial-gradient(circle at 86% 16%, rgba(211,246,37,0.3), transparent 42%), radial-gradient(circle at 72% 78%, rgba(8,75,167,0.14), transparent 44%)",
        }}
      />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-16 sm:px-10">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-[#0d172a]/10 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#084ba7]">
              Error 404
            </p>

            <h1 className="text-balance font-display text-5xl leading-[0.94] tracking-tight sm:text-6xl md:text-7xl">
              Lost In Space?
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-relaxed text-[#33415c] sm:text-base">
              The page you are looking for drifted out of orbit. Let&apos;s guide you back to a place that exists.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="rounded-full bg-[#d3f625] px-6 py-3 text-sm font-semibold text-[#0d172a] shadow-[0_14px_30px_rgba(211,246,37,0.35)] transition hover:translate-y-[-1px] hover:bg-[#defd5f]"
              >
                Back to Home
              </Link>
              <Link
                href="/get-started"
                className="rounded-full border border-[#0d172a]/15 bg-white/80 px-6 py-3 text-sm font-semibold text-[#084ba7] transition hover:border-[#084ba7]/35 hover:bg-white"
              >
                Open Get Started
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[420px]">
            <div className="absolute inset-0 rounded-full border border-[#084ba7]/15" />
            <div className="absolute inset-[12%] rounded-full border border-[#084ba7]/25" />
            <div className="absolute inset-[24%] rounded-full border border-[#084ba7]/35" />
            <div className="absolute inset-[36%] rounded-full border border-[#084ba7]/45" />

            <div className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0d172a] shadow-[0_18px_40px_rgba(8,75,167,0.28)]" />
            <div className="absolute left-[24%] top-[42%] h-5 w-5 rounded-full bg-[#5fa3ff] shadow-[0_0_16px_rgba(95,163,255,0.7)]" />
            <div className="absolute left-[68%] top-[30%] h-3.5 w-3.5 rounded-full bg-[#d3f625] shadow-[0_0_14px_rgba(211,246,37,0.72)]" />
            <div className="absolute left-[70%] top-[70%] h-2.5 w-2.5 rounded-full bg-[#084ba7]" />
            <p className="absolute bottom-4 right-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-[#084ba7]">
              orbit not found
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
