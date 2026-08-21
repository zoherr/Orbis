"use client";
import React, { useState, useMemo } from "react";
import { FiChevronLeft, FiChevronRight, FiCalendar, FiEdit2 } from "react-icons/fi";
import { format } from "date-fns";
import { Orbit } from "@/store/orbitStore";
import { formatScheduled } from "./utils";

const today = new Date();
const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dayKey = (d: Date) => `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

function buildCalendarDays(year: number, month: number) {
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const cells: { date: Date; inMonth: boolean }[] = [];

    for (let i = startWeekday - 1; i >= 0; i--) cells.push({ date: new Date(year, month - 1, daysInPrevMonth - i), inMonth: false });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month, d), inMonth: true });
    while (cells.length < 42) {
        const last = cells[cells.length - 1].date;
        cells.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
    }
    return cells;
}

export function OrbitCalendar({ orbits, onEdit }: { orbits: Orbit[]; onEdit: (orbit: Orbit) => void }) {
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const cells = useMemo(() => buildCalendarDays(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
    const byDay = useMemo(() => {
        const map = new Map<string, Orbit[]>();
        orbits.forEach((o) => {
            const dateStr = o.date ? o.date.split("T")[0] : o.joinTime ? o.joinTime.split("T")[0] : null;
            if (dateStr) {
                map.set(dateStr, [...(map.get(dateStr) ?? []), o]);
            }
        });
        return map;
    }, [orbits]);

    const defaultSelected = today;
    const [selectedDay, setSelectedDay] = useState<Date>(defaultSelected);
    const selectedOrbits = byDay.get(dayKey(selectedDay)) ?? [];

    const changeMonth = (delta: number) => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1));
    const weekdayLabels = ["S", "M", "T", "W", "T", "F", "S"];

    return (
        <div className="flex flex-col gap-6 lg:h-full">
            <div className="rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_8px_30px_rgba(8,75,167,0.04)] shrink-0">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-medium italic text-[#0d172a]" style={{ fontFamily: '"FC Fast", sans-serif' }}>
                        {format(viewDate, "MMMM yyyy")}
                    </h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => changeMonth(-1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dfe7f3] text-[#5b697d] hover:border-[#5fa3ff]/40 hover:text-[#084ba7]"><FiChevronLeft size={16} /></button>
                        <button onClick={() => changeMonth(1)} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#dfe7f3] text-[#5b697d] hover:border-[#5fa3ff]/40 hover:text-[#084ba7]"><FiChevronRight size={16} /></button>
                    </div>
                </div>

                <div className="mb-2 grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-wider text-[#9aa6b8]">
                    {weekdayLabels.map((d, i) => <div key={i}>{d}</div>)}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {cells.map(({ date, inMonth }, i) => {
                        const key = dayKey(date);
                        const dayOrbits = byDay.get(key) ?? [];
                        const isToday = isSameDay(date, today);
                        const isSelected = isSameDay(date, selectedDay);

                        return (
                            <button
                                key={i}
                                onClick={() => setSelectedDay(date)}
                                disabled={!inMonth}
                                className={`relative flex aspect-square flex-col items-center justify-center gap-1 rounded-xl text-sm transition ${
                                    !inMonth ? "text-[#d5dae3]" :
                                    isSelected ? "bg-[#0d172a] text-white font-bold" :
                                    isToday ? "border border-[#d3f625] text-[#0d172a] font-bold" :
                                    "text-[#0d172a] hover:bg-[#f7f9fc]"
                                }`}
                            >
                                <span className="z-10">{date.getDate()}</span>
                                {dayOrbits.length > 0 && !isSelected && (
                                    <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-[#5fa3ff]" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_8px_30px_rgba(8,75,167,0.04)] lg:flex-1 flex flex-col lg:min-h-0 lg:overflow-hidden">
                <div className="shrink-0">
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#9aa6b8]">
                        {format(selectedDay, "EEEE")}
                    </p>
                    <h4 className="mb-6 text-lg font-bold text-[#0d172a]">
                        {format(selectedDay, "MMMM do")}
                    </h4>
                </div>

                {selectedOrbits.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfe7f3] py-8 text-center shrink-0">
                        <FiCalendar className="mb-2 text-[#c3cbd8]" size={20} />
                        <p className="text-xs text-[#9aa6b8]">Nothing orbiting</p>
                    </div>
                ) : (
                    <div className="space-y-3 lg:flex-1 lg:overflow-y-auto custom-scrollbar lg:pr-2 mt-2">
                        {selectedOrbits.map((orbit) => (
                            <button
                                key={orbit._id}
                                onClick={() => onEdit(orbit)}
                                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-[#dfe7f3] bg-[#f7f9fc] p-3 text-left transition hover:border-[#5fa3ff]/40 cursor-pointer"
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-[#0d172a]">{orbit.title}</p>
                                    <p className="text-[10px] text-[#6a7892]">
                                        {orbit.type !== "instant" && orbit.date && orbit.time ? formatScheduled(orbit.date, orbit.time) : "Instant Meeting"}
                                    </p>
                                </div>
                                <FiEdit2 size={14} className="shrink-0 text-[#9aa6b8]" />
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
