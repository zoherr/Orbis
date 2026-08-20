"use client";

import { useMemo, useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
    FiPlus, FiHash, FiCalendar, FiClock, FiVideo, FiEdit2,
    FiCopy, FiZap, FiArrowUpRight, FiLink, FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import { Modal } from "@/components/ui/Modal";
import { SpacesHeader } from "@/components/spaces/SpacesHeader";
import orbitStore, { Orbit, OrbitGroup } from "@/store/orbitStore";
import { format } from "date-fns";

/* ---------------------------------- Types ---------------------------------- */
type Mode = "now" | "scheduled";

/* --------------------------------- Helpers --------------------------------- */
const today = new Date();
const addDays = (base: Date, days: number) => { const d = new Date(base); d.setDate(d.getDate() + days); return d; };
const isSameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const dayKey = (d: Date) => `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

const formatScheduled = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return "";
    const d = new Date(`${dateStr.split("T")[0]}T${timeStr}`);
    return format(d, "dd MMMM yyyy · hh:mm a");
};

const countdown = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return "";
    const d = new Date(`${dateStr.split("T")[0]}T${timeStr}`);
    const diffMs = d.getTime() - Date.now();
    if (diffMs <= 0) return "Starting soon";
    const days = Math.floor(diffMs / 86400000);
    const hours = Math.floor((diffMs % 86400000) / 3600000);
    if (days > 0) return `in ${days}d ${hours}h`;
    const mins = Math.floor((diffMs % 3600000) / 60000);
    return hours > 0 ? `in ${hours}h ${mins}m` : `in ${mins}m`;
};

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

/* -------------------------------- Small bits -------------------------------- */
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

/* ------------------------------ My Orbit Card ------------------------------ */
function MyOrbitCard({ orbit, onEdit }: { orbit: Orbit; onEdit: (orbit: Orbit) => void }) {
    const isLive = !orbit.date || !orbit.time;
    
    return (
        <div className="group relative overflow-hidden rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_8px_30px_rgba(8,75,167,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(8,75,167,0.08)]">
            <div className="mb-5 flex items-start justify-between">
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl border shadow-sm ${
                    isLive ? "border-[#d3f625] bg-[#0d172a] text-[#d3f625]" : "border-[#dfe7f3] bg-white text-[#084ba7]"
                }`}>
                    {isLive && <span className="absolute -inset-1.5 animate-ping rounded-2xl border border-[#d3f625]/50" />}
                    <FiVideo size={20} />
                </div>
                <StatusBadge isLive={isLive} />
            </div>

            <h3 className="mb-1 text-lg font-bold text-[#0d172a] truncate">{orbit.title}</h3>
            <p className="mb-5 flex items-center gap-1.5 text-sm font-medium text-[#6a7892]">
                {!isLive ? (
                    <><FiClock size={13} /> {formatScheduled(orbit.date, orbit.time)} · <span className="text-[#084ba7]">{countdown(orbit.date, orbit.time)}</span></>
                ) : (
                    "Started just now"
                )}
            </p>

            <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-5">
                <CodeChip code={orbit.code} />
                <div className="flex items-center gap-2">
                    {!isLive && (
                        <button onClick={() => onEdit(orbit)} aria-label="Edit orbit" className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dfe7f3] text-[#5b697d] transition hover:border-[#5fa3ff]/40 hover:text-[#084ba7]">
                            <FiEdit2 size={14} />
                        </button>
                    )}
                    {isLive && (
                        <button className="flex items-center gap-1.5 rounded-full bg-[#0d172a] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1a2842]">
                            Enter <FiArrowUpRight size={13} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* --------------------------------- Calendar --------------------------------- */
function OrbitCalendar({ orbits, onEdit }: { orbits: Orbit[]; onEdit: (orbit: Orbit) => void }) {
    const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

    const cells = useMemo(() => buildCalendarDays(viewDate.getFullYear(), viewDate.getMonth()), [viewDate]);
    const byDay = useMemo(() => {
        const map = new Map<string, Orbit[]>();
        // Map all orbits (both created and joined) to their dates for the yellow dot indicator
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
        <div className="flex flex-col gap-6">
            <div className="rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_8px_30px_rgba(8,75,167,0.04)]">
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

            <div className="rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_8px_30px_rgba(8,75,167,0.04)]">
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.14em] text-[#9aa6b8]">
                    {format(selectedDay, "EEEE")}
                </p>
                <h4 className="mb-6 text-lg font-bold text-[#0d172a]">
                    {format(selectedDay, "MMMM do")}
                </h4>

                {selectedOrbits.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#dfe7f3] py-8 text-center">
                        <FiCalendar className="mb-2 text-[#c3cbd8]" size={20} />
                        <p className="text-xs text-[#9aa6b8]">Nothing orbiting</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {selectedOrbits.map((orbit) => (
                            <button
                                key={orbit._id}
                                onClick={() => orbit.date && orbit.time && onEdit(orbit)}
                                className={`flex w-full items-center justify-between gap-3 rounded-2xl border border-[#dfe7f3] bg-[#f7f9fc] p-3 text-left transition ${orbit.date ? "hover:border-[#5fa3ff]/40" : "cursor-default"}`}
                            >
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-bold text-[#0d172a]">{orbit.title}</p>
                                    <p className="text-[10px] text-[#6a7892]">
                                        {orbit.date && orbit.time ? formatScheduled(orbit.date, orbit.time) : "Instant Meeting"}
                                    </p>
                                </div>
                                {orbit.date && orbit.time && <FiEdit2 size={14} className="shrink-0 text-[#9aa6b8]" />}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ------------------------ Recent Activity (Github Style) ----------------------- */
function RecentActivityGraph({ groups }: { groups: OrbitGroup[] }) {
    const days = useMemo(() => {
        const result = [];
        for (let i = 34; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = format(d, "yyyy-MM-dd");
            const group = groups.find(g => g.date === dateStr);
            result.push({ date: dateStr, count: group ? group.orbits.length : 0, parsedDate: d });
        }
        return result;
    }, [groups]);

    const getColor = (count: number) => {
        if (count === 0) return "bg-[#f1f5f9] hover:bg-[#e2e8f0]";
        if (count === 1) return "bg-[#93c5fd] hover:bg-[#60a5fa]";
        if (count === 2) return "bg-[#3b82f6] hover:bg-[#2563eb]";
        return "bg-[#1d4ed8] hover:bg-[#1e40af]"; 
    };

    return (
        <div className="rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_8px_30px_rgba(8,75,167,0.04)]">
            <h3 className="mb-4 text-lg font-bold text-[#0d172a]">Recent Activity</h3>
            <div className="flex flex-wrap gap-2">
                {days.map((day) => (
                    <div
                        key={day.date}
                        className={`group relative h-5 w-5 rounded-md transition-colors ${getColor(day.count)}`}
                    >
                        <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-gray-900 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 shadow-xl">
                            {day.count} orbits joined on {format(day.parsedDate, "dd MMMM yyyy")}
                            <div className="absolute left-1/2 top-full -mt-0.5 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex items-center justify-end gap-2 text-[10px] text-[#5b697d] font-semibold uppercase tracking-wider">
                <span>Less</span>
                <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-sm bg-[#f1f5f9]"></div>
                    <div className="h-3 w-3 rounded-sm bg-[#93c5fd]"></div>
                    <div className="h-3 w-3 rounded-sm bg-[#3b82f6]"></div>
                    <div className="h-3 w-3 rounded-sm bg-[#1d4ed8]"></div>
                </div>
                <span>More</span>
            </div>
        </div>
    );
}

/* ---------------------------- Create Orbit Modal --------------------------- */
function CreateOrbitModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (title: string, mode: Mode, date?: string, time?: string) => Promise<void> }) {
    const [mode, setMode] = useState<Mode>("now");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            setMode("now"); setTitle(""); setDate(""); setTime("");
        }
    }, [open]);

    const canContinue = title.trim() && (mode === "now" || (date && time));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canContinue) return;
        setIsSubmitting(true);
        const actualDate = mode === "now" ? format(new Date(), "yyyy-MM-dd") : date;
        const actualTime = mode === "now" ? format(new Date(), "HH:mm") : time;
        await onCreate(title.trim(), mode, actualDate, actualTime);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose} title="Create an Orbit" description="Start a live orbit now, or schedule one for later.">
            <div className="mb-6 flex rounded-full border border-[#dfe7f3] bg-[#f7f9fc] p-1">
                <button type="button" onClick={() => setMode("now")} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${mode === "now" ? "bg-[#0d172a] text-white shadow-sm" : "text-[#5b697d] hover:text-[#0d172a]"}`}>
                    <FiZap size={14} /> Start now
                </button>
                <button type="button" onClick={() => setMode("scheduled")} className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${mode === "scheduled" ? "bg-[#0d172a] text-white shadow-sm" : "text-[#5b697d] hover:text-[#0d172a]"}`}>
                    <FiCalendar size={14} /> Schedule
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">Orbit name</label>
                    <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder={mode === "now" ? "Quick design sync" : "Product roadmap review"} className="w-full rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15" />
                </div>
                {mode === "scheduled" && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">Date</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15" />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">Time</label>
                            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15" />
                        </div>
                    </div>
                )}
                <button type="submit" disabled={!canContinue || isSubmitting} className="w-full rounded-full bg-[#d3f625] px-6 py-3.5 text-sm font-semibold text-[#0d172a] shadow-[0_18px_36px_rgba(211,246,37,0.35)] transition hover:bg-[#defd5f] disabled:opacity-60">
                    {isSubmitting ? "Creating..." : "Schedule Orbit"}
                </button>
            </form>
        </Modal>
    );
}

/* --------------------------------- Join modal -------------------------------- */
function JoinOrbitModal({ open, onClose, onJoin }: { open: boolean; onClose: () => void; onJoin: (code: string) => Promise<void> }) {
    const [digits, setDigits] = useState<string[]>(Array(8).fill(""));
    const [connecting, setConnecting] = useState(false);
    const code = digits.join("");
    const canSubmit = code.length === 8;

    const handleChange = (index: number, raw: string) => {
        const char = raw.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(-1);
        const next = [...digits]; next[index] = char; setDigits(next);
        if (char && index < 7) document.getElementById(`join-code-${index + 1}`)?.focus();
    };
    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) document.getElementById(`join-code-${index - 1}`)?.focus();
    };
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasted = e.clipboardData.getData("text").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8);
        if (!pasted) return;
        e.preventDefault();
        setDigits(pasted.split("").concat(Array(8).fill("")).slice(0, 8));
        document.getElementById(`join-code-${Math.min(pasted.length, 7)}`)?.focus();
    };
    const handleClose = () => { setDigits(Array(8).fill("")); setConnecting(false); onClose(); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setConnecting(true);
        await onJoin(code);
        setConnecting(false);
        handleClose();
    };

    return (
        <Modal open={open} onClose={handleClose} title="Join an Orbit" description="Enter the 8-character code your host shared with you.">
            {connecting ? (
                <div className="flex flex-col items-center justify-center py-8">
                    <div className="relative mb-4 h-16 w-16">
                        <div className="absolute inset-0 rounded-full border-2 border-[#dfe7f3]" />
                        <div className="absolute inset-0 animate-orbis-orbit-spin rounded-full border-2 border-transparent border-t-[#5fa3ff]" />
                    </div>
                    <p className="text-sm font-semibold text-[#0d172a]">Connecting to orbit…</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex justify-center gap-1.5 sm:gap-2">
                        {digits.slice(0, 4).map((digit, index) => (
                            <input key={index} id={`join-code-${index}`} value={digit} onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} onPaste={handlePaste} maxLength={1} className="h-12 w-9 sm:w-10 rounded-lg border border-[#dfe7f3] bg-white text-center text-sm sm:text-base font-mono font-bold uppercase text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15" />
                        ))}
                        <div className="flex items-center justify-center px-0.5 sm:px-1 text-[#9aa6b8] font-bold">-</div>
                        {digits.slice(4, 8).map((digit, i) => {
                            const index = i + 4;
                            return (
                                <input key={index} id={`join-code-${index}`} value={digit} onChange={(e) => handleChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} onPaste={handlePaste} maxLength={1} className="h-12 w-9 sm:w-10 rounded-lg border border-[#dfe7f3] bg-white text-center text-sm sm:text-base font-mono font-bold uppercase text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15" />
                            );
                        })}
                    </div>
                    <button type="submit" disabled={!canSubmit} className="w-full rounded-full bg-[#0d172a] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#1a2842] disabled:opacity-40">
                        Join Orbit
                    </button>
                </form>
            )}
        </Modal>
    );
}

/* -------------------------------- Update modal ------------------------------- */
function UpdateOrbitModal({ orbit, onClose, onUpdate }: { orbit: Orbit | null; onClose: () => void; onUpdate: (id: string, title: string, date: string, time: string) => Promise<void> }) {
    const [title, setTitle] = useState(orbit?.title ?? "");
    const [date, setDate] = useState(orbit?.date ? orbit.date.split("T")[0] : "");
    const [time, setTime] = useState(orbit?.time ?? "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (orbit) {
            setTitle(orbit.title);
            setDate(orbit.date ? orbit.date.split("T")[0] : "");
            setTime(orbit.time ?? "");
        }
    }, [orbit]);

    if (!orbit) return null;
    const canSubmit = title.trim() && date && time;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;
        setIsSubmitting(true);
        await onUpdate(orbit._id, title.trim(), date, time);
        setIsSubmitting(false);
        onClose();
    };

    return (
        <Modal open={!!orbit} onClose={onClose} title="Update Orbit" description="Change the title, date, or time of your scheduled orbit.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">Orbit name</label>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">Date</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15" />
                    </div>
                    <div>
                        <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">Time</label>
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15" />
                    </div>
                </div>
                <button type="submit" disabled={!canSubmit || isSubmitting} className="w-full rounded-full bg-[#d3f625] px-6 py-3.5 text-sm font-semibold text-[#0d172a] shadow-[0_18px_36px_rgba(211,246,37,0.35)] transition hover:bg-[#defd5f] disabled:opacity-60">
                    {isSubmitting ? "Saving..." : "Save changes"}
                </button>
            </form>
        </Modal>
    );
}

/* ----------------------------------- Page ----------------------------------- */
export default function OrbitsPage() {
    const { orbits, recentJoinedOrbits, getMyOrbits, getRecentJoinedOrbits, createOrbit, joinOrbit, updateOrbit, isLoading } = orbitStore();
    
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isJoinOpen, setIsJoinOpen] = useState(false);
    const [editingOrbit, setEditingOrbit] = useState<Orbit | null>(null);

    useEffect(() => {
        getMyOrbits();
        getRecentJoinedOrbits();
    }, [getMyOrbits, getRecentJoinedOrbits]);

    // Flatten grouped backend data
    const flatMyOrbits = useMemo(() => orbits.flatMap(g => g.orbits), [orbits]);
    const flatRecentOrbits = useMemo(() => recentJoinedOrbits.flatMap(g => g.orbits), [recentJoinedOrbits]);
    // Combine both for calendar so dots show up for all activity (deduplicated by _id)
    const allActivity = useMemo(() => {
        const combined = [...flatMyOrbits, ...flatRecentOrbits];
        const map = new Map<string, Orbit>();
        combined.forEach(o => map.set(o._id, o));
        return Array.from(map.values());
    }, [flatMyOrbits, flatRecentOrbits]);

    const handleCreate = async (title: string, mode: Mode, date?: string, time?: string) => {
        try {
            await createOrbit({ title, orbitDate: date, orbitTime: time });
            toast.success(mode === "now" ? "Orbit started!" : "Orbit scheduled!");
            getMyOrbits();
        } catch (error: any) {
            toast.error(error.message || "Failed to create orbit");
        }
    };

    const handleJoin = async (code: string) => {
        try {
            await joinOrbit({ orbitCode: code });
            toast.success(`Joined orbit ${code}`);
            getRecentJoinedOrbits();
        } catch (error: any) {
            toast.error(error.message || "Failed to join orbit");
        }
    };

    const handleUpdate = async (id: string, title: string, date: string, time: string) => {
        try {
            await updateOrbit({ _id: id, title, orbitDate: date, orbitTime: time });
            toast.success("Orbit updated successfully");
            getMyOrbits();
        } catch (error: any) {
            toast.error(error.message || "Failed to update orbit");
        }
    };

    return (
        <div className="min-h-screen bg-[#f7f7f4] font-sans">
            <SpacesHeader onJoinOpen={() => setIsJoinOpen(true)} onCreateOpen={() => setIsCreateOpen(true)} />

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-12">
                <div className="mb-10 sm:hidden flex gap-3">
                    <button onClick={() => setIsJoinOpen(true)} className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#dfe7f3] bg-white px-4 py-3 text-sm font-semibold text-[#0d172a]">
                        Join
                    </button>
                    <button onClick={() => setIsCreateOpen(true)} className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#d3f625] px-4 py-3 text-sm font-bold text-[#0d172a]">
                        New Orbit
                    </button>
                </div>

                {isLoading && flatMyOrbits.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0d172a]"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        
                        {/* LEFT COLUMN: Calendar */}
                        <div className="lg:col-span-3">
                            <OrbitCalendar orbits={allActivity} onEdit={setEditingOrbit} />
                        </div>

                        {/* MIDDLE COLUMN: My Orbits List */}
                        <div className="lg:col-span-6 flex flex-col gap-6">
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-[#0d172a]">My Orbits</h2>
                            </div>
                            
                            {flatMyOrbits.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#dfe7f3] bg-white/60 px-6 py-16 text-center">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ebf4ff] text-[#084ba7]"><FiVideo size={22} /></div>
                                    <h3 className="text-lg font-bold text-[#0d172a]">No orbits yet</h3>
                                    <p className="mt-1 max-w-sm text-sm text-[#5b697d]">Orbits you create will show up here.</p>
                                    <button onClick={() => setIsCreateOpen(true)} className="mt-6 rounded-full bg-[#0d172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a2842]">
                                        Create your first Orbit
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 pb-10">
                                    {flatMyOrbits.map((orbit) => (
                                        <MyOrbitCard key={orbit._id} orbit={orbit} onEdit={setEditingOrbit} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Recent Joined Activity (Github style) */}
                        <div className="lg:col-span-3">
                            <RecentActivityGraph groups={recentJoinedOrbits} />
                        </div>
                    </div>
                )}
            </main>

            <CreateOrbitModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleCreate} />
            <JoinOrbitModal open={isJoinOpen} onClose={() => setIsJoinOpen(false)} onJoin={handleJoin} />
            <UpdateOrbitModal orbit={editingOrbit} onClose={() => setEditingOrbit(null)} onUpdate={handleUpdate} />
        </div>
    );
}