"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";

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
