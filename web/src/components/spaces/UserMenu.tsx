"use client";
import { useRef, useState } from "react";
import { FiLogOut, FiChevronDown } from "react-icons/fi";
import { useClickOutside } from "@/hooks/useClickOutside";

interface UserMenuProps {
    fullName?: string;
    email?: string;
    profileImage?: string;
    onLogout: () => void;
}

export function UserMenu({ fullName, email, profileImage, onLogout }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);
    useClickOutside(rootRef, () => setOpen(false), open);

    const avatar = profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${fullName || "User"}`;

    return (
        <div ref={rootRef} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full border border-[#dfe7f3] bg-white py-1 pl-1 pr-3 shadow-sm transition hover:border-[#5fa3ff]/40"
            >
                <div className="h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-[#e2e8f0] shadow-sm">
                    <img src={avatar} alt={fullName || "Profile"} className="h-full w-full object-cover" />
                </div>
                <FiChevronDown size={14} className={`text-[#9aa6b8] transition-transform ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
                <div className="absolute right-0 z-50 mt-3 w-60 overflow-hidden rounded-2xl border border-[#dfe7f3] bg-white shadow-[0_20px_60px_rgba(8,75,167,0.12)]">
                    <div className="border-b border-[#f1f5f9] px-5 py-4">
                        <p className="truncate text-sm font-bold text-[#0d172a]">{fullName}</p>
                        <p className="truncate text-xs text-[#64748b]">{email}</p>
                    </div>
                    <button
                        onClick={() => {
                            setOpen(false);
                            onLogout();
                        }}
                        className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-[#e5484d] transition hover:bg-[#fdecec]"
                    >
                        <FiLogOut size={15} /> Sign out
                    </button>
                </div>
            )}
        </div>
    );
}
