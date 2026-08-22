"use client";
import React, { useState, useEffect } from "react";
import { FiZap, FiCalendar } from "react-icons/fi";
import { format } from "date-fns";
import { Modal } from "@/components/ui/Modal";
import { CustomDatePicker, CustomTimePicker } from "../Pickers";

export type Mode = "now" | "scheduled";

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
