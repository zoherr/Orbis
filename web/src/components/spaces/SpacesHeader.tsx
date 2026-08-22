"use client";
import { useState, useRef, useEffect } from "react";
import { FiVideo, FiHash, FiPlus, FiLogOut } from "react-icons/fi";
import { useAppAuth } from "@/components/providers/AppAuthProvider";
import authStore from "@/store/authStore";
import toast from "react-hot-toast";

interface SpacesHeaderProps {
    onJoinOpen: () => void;
    onCreateOpen: () => void;
}

export function SpacesHeader({ onJoinOpen, onCreateOpen }: SpacesHeaderProps) {
    const { user } = useAppAuth();
    const logout = authStore(s => s.logout);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
        } catch {
            toast.error("Failed to log out");
        }
    };

    return (
        <header className="flex h-[80px] shrink-0 items-center justify-between px-6 lg:px-16 bg-[#f7f7f4]">
            <div className="flex items-center gap-3">
                <img src="/logo.png" alt="Orbis Logo" className="h-10 w-auto object-contain" />
            </div>

            <div className="flex items-center gap-4">
                <button onClick={onJoinOpen} className="hidden sm:flex items-center gap-2 rounded-full border border-[#dfe7f3] bg-white px-5 py-2.5 text-sm font-semibold text-[#0d172a] shadow-sm transition hover:border-[#5fa3ff]/40">
                    <FiHash size={16} /> Join Code
                </button>
                <button onClick={onCreateOpen} className="hidden sm:flex items-center gap-2 rounded-full bg-[#d3f625] px-5 py-2.5 text-sm font-bold text-[#0d172a] shadow-[0_10px_20px_rgba(211,246,37,0.2)] transition hover:translate-y-[-1px] hover:bg-[#defd5f]">
                    <FiPlus size={18} /> New Orbit
                </button>

                <div className="h-8 w-px bg-[#dfe7f3] mx-2 hidden sm:block"></div>
                
                <div className="relative" ref={dropdownRef}>
                    <div 
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center gap-3 cursor-pointer p-1 rounded-full hover:bg-black/5 transition"
                    >
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-[#0d172a]">{user?.fullName || "Astronaut"}</span>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6a7892]">Online</span>
                        </div>
                        <div className="h-10 w-10 rounded-full overflow-hidden border border-[#dfe7f3] shadow-sm">
                            <img 
                                src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0d172a&color=d3f625`} 
                                className="h-full w-full object-cover" 
                                alt="Profile" 
                                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0d172a&color=d3f625`; }}
                            />
                        </div>
                    </div>

                    {showDropdown && (
                        <div className="absolute right-0 top-14 w-48 rounded-2xl border border-[#dfe7f3] bg-white p-2 shadow-xl z-50 animate-orbis-pop-in">
                            <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-[#e5484d] transition hover:bg-[#fdecec]">
                                <FiLogOut size={16} /> Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
