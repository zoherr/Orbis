"use client";
import { useState } from "react";
import { FiZap, FiCalendar, FiVideo, FiClock } from "react-icons/fi";
import { Modal } from "@/components/ui/Modal";

type Mode = "now" | "scheduled";

interface CreateOrbisModalProps {
    open: boolean;
    onClose: () => void;
    onCreated?: (orbis: { title: string; mode: Mode }) => void;
}

export function CreateOrbisModal({ open, onClose, onCreated }: CreateOrbisModalProps) {
    const [mode, setMode] = useState<Mode>("now");
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reset = () => {
        setMode("now");
        setTitle("");
        setDate("");
        setTime("");
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || (mode === "scheduled" && (!date || !time))) return;

        setIsSubmitting(true);
        try {
            // TODO: wire to your real endpoint, e.g. API.post("/orbis", { title, mode, date, time })
            await new Promise((resolve) => setTimeout(resolve, 500));
            onCreated?.({ title: title.trim(), mode });
            handleClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            title="Create an Orbis"
            description="Start a live space now, or schedule one for later."
        >
            <div className="mb-6 flex rounded-full border border-[#dfe7f3] bg-[#f7f9fc] p-1">
                <button
                    type="button"
                    onClick={() => setMode("now")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                        mode === "now" ? "bg-[#0d172a] text-white shadow-sm" : "text-[#5b697d] hover:text-[#0d172a]"
                    }`}
                >
                    <FiZap size={14} /> Start now
                </button>
                <button
                    type="button"
                    onClick={() => setMode("scheduled")}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                        mode === "scheduled" ? "bg-[#0d172a] text-white shadow-sm" : "text-[#5b697d] hover:text-[#0d172a]"
                    }`}
                >
                    <FiCalendar size={14} /> Schedule
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">
                        Orbis name
                    </label>
                    <input
                        autoFocus
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder={mode === "now" ? "Quick design sync" : "Product roadmap review"}
                        className="w-full rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm text-[#0d172a] outline-none transition placeholder:text-[#9aa6b8] focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15"
                    />
                </div>

                {mode === "scheduled" && (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15"
                            />
                        </div>
                        <div>
                            <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-[#5b697d]">
                                Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm text-[#0d172a] outline-none transition focus:border-[#5fa3ff] focus:ring-4 focus:ring-[#5fa3ff]/15"
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 rounded-xl bg-[#ebf4ff] px-4 py-3 text-xs text-[#084ba7]">
                    {mode === "now" ? (
                        <><FiVideo size={14} /> You&apos;ll jump straight into a live orbit.</>
                    ) : (
                        <><FiClock size={14} /> We&apos;ll send invites once it&apos;s scheduled.</>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || (mode === "scheduled" && (!date || !time))}
                    className="w-full rounded-full bg-[#d3f625] px-6 py-3.5 text-sm font-semibold text-[#0d172a] shadow-[0_18px_36px_rgba(211,246,37,0.35)] transition hover:translate-y-[-1px] hover:bg-[#defd5f] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? "Creating…" : mode === "now" ? "Start Orbis" : "Schedule Orbis"}
                </button>
            </form>
        </Modal>
    );
}
