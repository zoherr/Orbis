"use client";

import { useState } from "react";
import { FiSearch, FiBell, FiPlus, FiVideo, FiMenu } from "react-icons/fi";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { useAppAuth } from "@/components/providers/AppAuthProvider";
import authStore from "@/store/authStore";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { UserMenu } from "@/components/spaces/UserMenu";
import { CreateOrbisModal } from "@/components/spaces/CreateOrbisModal";
import { RecentOrbisGrid } from "@/components/spaces/RecentOrbisGrid";
import { OrbisItem } from "@/components/spaces/OrbisCard";

const initialOrbis: OrbisItem[] = [
    { id: 1, title: "Design System Sync", type: "Meeting", time: "2 hours ago", attendees: ["Alex", "Sarah", "+3"], gradient: "from-[#eef2ff] to-[#e0e7ff]" },
    { id: 2, title: "Marketing Q3 Review", type: "Space", time: "Yesterday", attendees: ["Liam", "Maya", "+8"], gradient: "from-[#f0fdf4] to-[#dcfce7]" },
    { id: 3, title: "Engineering Standup", type: "Meeting", time: "Yesterday", attendees: ["Noah", "Emma", "+12"], gradient: "from-[#fff7ed] to-[#ffedd5]" },
    { id: 4, title: "Product Brainstorm", type: "Space", time: "Aug 15", attendees: ["Oliver", "Ava"], gradient: "from-[#fdf2f8] to-[#fce7f3]" },
];

export default function SpacesPage() {
    const { user } = useAppAuth();
    const logout = authStore((state) => state.logout);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [orbisItems, setOrbisItems] = useState<OrbisItem[]>(initialOrbis);

    const firstName = user?.fullName?.split(" ")[0] || "Explorer";

    const handleLogout = async () => {
        try {
            await logout();
            toast.success("Logged out successfully");
        } catch {
            toast.error("Failed to log out");
        }
    };

    const handleOrbisCreated = ({ title, mode }: { title: string; mode: "now" | "scheduled" }) => {
        setOrbisItems((prev) => [
            {
                id: crypto.randomUUID(),
                title,
                type: "Meeting",
                time: mode === "now" ? "Just now" : "Scheduled",
                attendees: [firstName],
                gradient: "from-[#eef2ff] to-[#e0e7ff]",
            },
            ...prev,
        ]);
        toast.success(mode === "now" ? "Orbis started" : "Orbis scheduled");
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#f7f7f4] font-sans">
            <div className="hidden md:block">
                <AppSidebar />
            </div>

            <main className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
                <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#dfe7f3]/50 bg-[#f7f7f4]/80 px-6 backdrop-blur-xl lg:px-12">
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-[#0d172a] md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                            <FiMenu size={24} />
                        </button>
                        <div className="relative hidden items-center sm:flex">
                            <FiSearch className="absolute left-4 text-[#9ca3af]" />
                            <input
                                type="text"
                                placeholder="Search your Orbis..."
                                className="w-64 rounded-full border border-[#dfe7f3] bg-white py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#084ba7] focus:ring-1 focus:ring-[#084ba7] lg:w-96"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 lg:gap-6">
                        <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe7f3] bg-white text-[#4b5563] shadow-sm transition-colors hover:text-[#084ba7]">
                            <FiBell size={18} />
                            <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#d3f625]" />
                        </button>

                        <UserMenu
                            fullName={user?.fullName}
                            email={user?.email}
                            profileImage={user?.profileImage}
                            onLogout={handleLogout}
                        />
                    </div>
                </header>

                <div className="mx-auto w-full max-w-7xl px-6 py-10 pb-24 lg:px-12">
                    <div className="mb-10">
                        <h1 className="mb-2 text-4xl font-bold tracking-tight text-[#0d172a] sm:text-5xl">
                            Welcome to your Orbis, {firstName}.
                        </h1>
                        <p className="text-lg text-[#46536a]">Create your space. Find your orbit.</p>
                    </div>

                    <section className="relative mb-16 flex w-full flex-col items-center justify-between gap-10 overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#084ba7] to-[#04285e] p-8 shadow-[0_20px_60px_rgba(8,75,167,0.2)] sm:p-12 md:flex-row lg:p-16">
                        <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/4 rounded-full border border-white/10" />
                        <div className="absolute right-0 top-0 h-[300px] w-[300px] translate-x-1/2 -translate-y-1/2 rounded-full border border-[#5fa3ff]/30" />

                        <div className="relative z-10 max-w-xl">
                            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#d3f625] backdrop-blur-md">
                                Orbis Live
                            </span>
                            <h2 className="mb-6 text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-5xl">
                                Start a new meeting or jump into a space.
                            </h2>
                            <div className="flex flex-wrap items-center gap-4">
                                <button
                                    onClick={() => setIsCreateOpen(true)}
                                    className="flex items-center gap-2 rounded-full bg-[#d3f625] px-8 py-4 text-sm font-bold text-[#0d172a] shadow-lg transition-transform hover:scale-105 hover:bg-[#defd5f]"
                                >
                                    <FiPlus size={20} /> Create an Orbis
                                </button>
                                <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur-md transition-colors hover:bg-white/20">
                                    <FiVideo size={20} /> Join with Code
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10 hidden items-center justify-center md:flex">
                            <div className="relative h-48 w-48 rounded-full bg-gradient-to-tr from-[#5fa3ff] to-[#084ba7] p-2 shadow-[0_0_80px_rgba(95,163,255,0.4)] sm:h-64 sm:w-64">
                                <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-[#084ba7] bg-[#04285e]">
                                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#d3f625] shadow-[0_0_40px_rgba(211,246,37,0.3)]">
                                        <FiVideo className="text-3xl text-[#0d172a]" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-8 flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-[#0d172a]">Recent Orbis</h2>
                            <button className="text-sm font-semibold text-[#084ba7] hover:underline">View Calendar</button>
                        </div>

                        <RecentOrbisGrid items={orbisItems} onCreate={() => setIsCreateOpen(true)} />
                    </section>
                </div>
            </main>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <div className="relative flex h-full w-64 flex-col bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#f1f5f9] p-6">
                            <Image src="/logo.png" alt="Orbis" width={80} height={28} />
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-[#64748b]">
                                <FiPlus className="rotate-45 text-2xl" />
                            </button>
                        </div>
                        <div className="flex-1 p-4">
                            <nav className="space-y-2">
                                <Link href="/spaces" className="flex items-center gap-3 rounded-xl bg-[#ebf4ff] px-4 py-3 font-semibold text-[#084ba7]">
                                    <FiVideo /> Dashboard
                                </Link>
                                <Link href="/blogs" className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-[#4b5563] hover:bg-[#f8f9fc]">
                                    <FiPlus className="rotate-45" /> Journal
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            <CreateOrbisModal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreated={handleOrbisCreated} />
        </div>
    );
}
