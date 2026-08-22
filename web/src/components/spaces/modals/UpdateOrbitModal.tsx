"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Orbit } from "@/store/orbitStore";
import { CustomDatePicker, CustomTimePicker } from "../Pickers";

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
