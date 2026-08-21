"use client";
import React, { useMemo, useState, useRef, useLayoutEffect } from "react";
import { format, startOfWeek, addDays, isSameMonth } from "date-fns";
import { OrbitGroup } from "@/store/orbitStore";

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

type Hovered = { date: string; count: number; cellX: number; cellY: number; cellW: number };

export function RecentActivityGraph({ groups }: { groups: OrbitGroup[] }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [hovered, setHovered] = useState<Hovered | null>(null);
    const [tooltipStyle, setTooltipStyle] = useState<{ left: number; top: number; arrowLeft: number }>({
        left: 0,
        top: 0,
        arrowLeft: 50,
    });

    const weeks = useMemo(() => {
        const today = new Date();
        const rangeStart = startOfWeek(addDays(today, -34));
        const totalDays = Math.ceil((today.getTime() - rangeStart.getTime()) / 86400000) + 1;

        const allDays = Array.from({ length: totalDays }, (_, i) => {
            const d = addDays(rangeStart, i);
            const dateStr = format(d, "yyyy-MM-dd");
            const group = groups.find(g => g.date === dateStr);
            return { date: dateStr, count: group ? group.orbits.length : 0, parsedDate: d };
        });

        const cols: (typeof allDays)[] = [];
        for (let i = 0; i < allDays.length; i += 7) cols.push(allDays.slice(i, i + 7));
        return cols;
    }, [groups]);

    const monthLabels = useMemo(() => {
        return weeks.map((week, i) => {
            const first = week[0];
            const prevWeek = weeks[i - 1];
            const isNewMonth = i === 0 || (prevWeek && !isSameMonth(prevWeek[0].parsedDate, first.parsedDate));
            return isNewMonth ? format(first.parsedDate, "MMM") : "";
        });
    }, [weeks]);

    const getColor = (count: number) => {
        if (count === 0) return "bg-[#f1f5f9] hover:bg-[#e2e8f0]";
        if (count === 1) return "bg-[#93c5fd] hover:bg-[#60a5fa]";
        if (count === 2) return "bg-[#3b82f6] hover:bg-[#2563eb]";
        return "bg-[#1d4ed8] hover:bg-[#1e40af]";
    };

    const getDotColor = (count: number) => {
        if (count === 0) return "#cbd5e1";
        if (count === 1) return "#93c5fd";
        if (count === 2) return "#3b82f6";
        return "#1d4ed8";
    };

    useLayoutEffect(() => {
        if (!hovered || !containerRef.current || !tooltipRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        const margin = 8;

        const idealLeft = hovered.cellX + hovered.cellW / 2 - tooltipRect.width / 2;
        const clampedLeft = Math.min(
            Math.max(idealLeft, margin),
            containerRect.width - tooltipRect.width - margin
        );

        const arrowCenter = hovered.cellX + hovered.cellW / 2 - clampedLeft;
        const arrowLeftPct = Math.min(Math.max((arrowCenter / tooltipRect.width) * 100, 12), 88);

        setTooltipStyle({
            left: clampedLeft,
            top: hovered.cellY - tooltipRect.height - 10,
            arrowLeft: arrowLeftPct,
        });
    }, [hovered]);

    return (
        <div ref={containerRef} className="relative rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_8px_30px_rgba(8,75,167,0.04)]">
            <h3 className="mb-5 text-lg font-bold text-[#0d172a]">Recent Activity</h3>

            <div className="flex gap-2">
                {/* Weekday labels */}
                <div className="flex flex-col justify-between gap-1 pt-4 pb-px">
                    {WEEKDAY_LABELS.map((label, i) => (
                        <span key={i} className="h-full text-[10px] leading-none text-[#8a97ab] flex items-center">
                            {label}
                        </span>
                    ))}
                </div>

                {/* Grid stretches to fill remaining width */}
                <div className="flex flex-1 gap-1.5">
                    {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-1 flex-col gap-1">
                            <span className="block h-3 text-center text-[10px] leading-3 text-[#8a97ab]">
                                {monthLabels[wi]}
                            </span>
                            {week.map((day) => (
                                <div
                                    key={day.date}
                                    className={`aspect-square w-full rounded-[4px] transition-colors cursor-pointer ${getColor(day.count)} ${
                                        hovered?.date === day.date ? "ring-2 ring-[#0d172a]/20" : ""
                                    }`}
                                    onMouseEnter={(e) => {
                                        const cellRect = e.currentTarget.getBoundingClientRect();
                                        const containerRect = containerRef.current!.getBoundingClientRect();
                                        setHovered({
                                            date: day.date,
                                            count: day.count,
                                            cellX: cellRect.left - containerRect.left,
                                            cellY: cellRect.top - containerRect.top,
                                            cellW: cellRect.width,
                                        });
                                    }}
                                    onMouseLeave={() => setHovered(null)}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-4 flex items-center justify-end gap-2 text-[10px] font-semibold uppercase tracking-wider text-[#5b697d]">
                <span>Less</span>
                <div className="flex gap-1">
                    <div className="h-2.5 w-2.5 rounded-sm bg-[#f1f5f9]" />
                    <div className="h-2.5 w-2.5 rounded-sm bg-[#93c5fd]" />
                    <div className="h-2.5 w-2.5 rounded-sm bg-[#3b82f6]" />
                    <div className="h-2.5 w-2.5 rounded-sm bg-[#1d4ed8]" />
                </div>
                <span>More</span>
            </div>

            {hovered && (
                <div
                    ref={tooltipRef}
                    className="pointer-events-none absolute z-10 rounded-xl border border-[#1e293b] bg-[#0d172a] px-3 py-2 shadow-xl animate-in fade-in zoom-in-95 duration-150"
                    style={{ left: tooltipStyle.left, top: tooltipStyle.top }}
                >
                    <div className="flex items-center gap-2 whitespace-nowrap">
                        <span
                            className="h-2 w-2 shrink-0 rounded-full"
                            style={{ backgroundColor: getDotColor(hovered.count) }}
                        />
                        <span className="text-[12px] font-semibold text-white">
                            {hovered.count} orbit{hovered.count === 1 ? "" : "s"}
                        </span>
                        <span className="text-[11px] text-[#94a3b8]">
                            {format(new Date(hovered.date), "EEE, dd MMM yyyy")}
                        </span>
                    </div>
                    <div
                        className="absolute top-full h-2 w-2 -translate-y-1 rotate-45 border-b border-r border-[#1e293b] bg-[#0d172a]"
                        style={{ left: `${tooltipStyle.arrowLeft}%`, transform: "translate(-50%, -4px) rotate(45deg)" }}
                    />
                </div>
            )}
        </div>
    );
}