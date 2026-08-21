"use client";
import { useEffect, ReactNode } from "react";
import { FiX } from "react-icons/fi";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    maxWidth?: string;
}

export function Modal({ open, onClose, title, description, children, maxWidth = "max-w-md" }: ModalProps) {
    useEffect(() => {
        if (!open) return;
        const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[70] flex items-start justify-center pt-20 p-4">
            <div className="absolute inset-0 animate-orbis-fade-in bg-[#0d172a]/50 backdrop-blur-sm" onClick={onClose} />
            <div
                role="dialog"
                aria-modal="true"
                className={`relative w-full ${maxWidth} animate-orbis-modal-in rounded-[1.75rem] border border-[#dfe7f3] bg-white p-7 shadow-[0_30px_90px_rgba(13,23,42,0.25)]`}
            >
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#0d172a]">{title}</h2>
                        {description && <p className="mt-1 text-sm text-[#5b697d]">{description}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="shrink-0 rounded-full p-2 text-[#9aa6b8] transition hover:bg-[#f2f5f9] hover:text-[#0d172a]"
                    >
                        <FiX size={18} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}
