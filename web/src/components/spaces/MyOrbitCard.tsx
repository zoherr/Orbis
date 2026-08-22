"use client";
import React from "react";
import { FiClock, FiVideo, FiEdit2, FiCopy, FiHash, FiArrowUpRight } from "react-icons/fi";
import toast from "react-hot-toast";
import { Orbit } from "@/store/orbitStore";
import { formatScheduled, getOrbitStatus } from "./utils";
import Link from "next/link";

function StatusBadge({ isLive }: { isLive: boolean }) {
    if (isLive) {
        return (
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#f2fbcf] text-[#5c7a00]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#5c7a00] animate-pulse" /> Live now
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-[#ebf4ff] text-[#084ba7]">
            Scheduled
        </span>
    );
}

function CodeChip({ code }: { code: string }) {
    const displayCode = code.length === 8 ? `${code.slice(0, 4)}-${code.slice(4)}` : code;
    return (
        <button
            onClick={() => { navigator.clipboard.writeText(displayCode); toast.success("Code copied"); }}
            className="flex items-center gap-2 rounded-full border border-[#dfe7f3] bg-[#f7f9fc] px-3 py-1.5 text-xs font-mono font-semibold tracking-wider text-[#4b5563] transition hover:border-[#5fa3ff]/40 hover:text-[#084ba7]"
        >
            <FiHash size={12} />{displayCode}<FiCopy size={12} className="text-[#9aa6b8]" />
        </button>
    );
}

export function MyOrbitCard({ orbit, onEdit }: { orbit: Orbit; onEdit: (orbit: Orbit) => void }) {
    const status = getOrbitStatus(orbit);
    
    return (
        <div className="group relative overflow-hidden rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_8px_30px_rgba(8,75,167,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(8,75,167,0.08)]">
            <div className="mb-5 flex items-start justify-between">
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm ${
                    status.isLive ? "border-[#d3f625] bg-[#0d172a] text-[#d3f625]" : "border-[#dfe7f3] bg-white text-[#084ba7]"
                }`}>
                    {status.isLive && <span className="absolute -inset-1.5 animate-ping rounded-2xl border border-[#d3f625]/50" />}
                    <FiVideo size={20} />
                </div>
                <StatusBadge isLive={status.isLive} />
            </div>

            <h3 className="mb-1 text-lg font-bold text-[#0d172a] truncate">{orbit.title}</h3>
            <div className="mb-5 h-5 flex flex-wrap items-center gap-2 text-sm font-medium text-[#6a7892]">
                {!status.isLive ? (
                    <>
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <FiClock size={13} />
                            <span>{formatScheduled(orbit.date, orbit.time)}</span>
                        </div>
                        <span className="rounded-md bg-[#ebf4ff] px-2 py-0.5 text-xs font-bold tracking-wide text-[#084ba7] whitespace-nowrap">
                            {status.text}
                        </span>
                    </>
                ) : (
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <FiClock size={13} /> {status.text}
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-5">
                <CodeChip code={orbit.code} />
                <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(orbit)} aria-label="Edit orbit" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe7f3] text-[#5b697d] transition hover:border-[#5fa3ff]/40 hover:text-[#084ba7]">
                        <FiEdit2 size={14} />
                    </button>
                    {status.isLive && (
                        <Link href={`/join/${orbit.code}`} className="flex items-center gap-1.5 rounded-full bg-[#0d172a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1a2842]">
                            Enter <FiArrowUpRight size={13} />
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
