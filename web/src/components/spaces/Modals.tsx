"use client";
import React, { useState, useEffect } from "react";
import { FiZap, FiCalendar } from "react-icons/fi";
import { format } from "date-fns";
import { Modal } from "@/components/ui/Modal";
import { Orbit } from "@/store/orbitStore";
import { CustomDatePicker, CustomTimePicker } from "./Pickers";

type Mode = "now" | "scheduled";

export function CreateOrbitModal({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (title: string, mode: Mode, date?: string, time?: string) => Promise<void> }) {
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
                            <CustomDatePicker value={date} onChange={setDate} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">Time</label>
                            <CustomTimePicker value={time} onChange={setTime} />
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

export function JoinOrbitModal({ open, onClose, onJoin }: { open: boolean; onClose: () => void; onJoin: (code: string) => Promise<void> }) {
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

export function UpdateOrbitModal({ orbit, onClose, onUpdate }: { orbit: Orbit | null; onClose: () => void; onUpdate: (id: string, title: string, date: string, time: string) => Promise<void> }) {
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
    const canSubmit = title.trim() && (orbit.type === "instant" || (date && time));

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
                {orbit.type !== "instant" && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">Date</label>
                            <CustomDatePicker value={date} onChange={setDate} />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">Time</label>
                            <CustomTimePicker value={time} onChange={setTime} />
                        </div>
                    </div>
                )}
                <button type="submit" disabled={!canSubmit || isSubmitting} className="w-full rounded-full bg-[#d3f625] px-6 py-3.5 text-sm font-semibold text-[#0d172a] shadow-[0_18px_36px_rgba(211,246,37,0.35)] transition hover:bg-[#defd5f] disabled:opacity-60">
                    {isSubmitting ? "Saving..." : "Save changes"}
                </button>
            </form>
        </Modal>
    );
}
