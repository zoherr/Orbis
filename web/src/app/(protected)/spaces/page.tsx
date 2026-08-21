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

import { OrbitCalendar } from "@/components/spaces/OrbitCalendar";
import { MyOrbitCard } from "@/components/spaces/MyOrbitCard";
import { RecentActivityGraph } from "@/components/spaces/RecentActivityGraph";
import { CreateOrbitModal, JoinOrbitModal, UpdateOrbitModal } from "@/components/spaces/Modals";

/* ---------------------------------- Types ---------------------------------- */
type Mode = "now" | "scheduled";

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
    const displayMyOrbits = useMemo(() => {
        const now = new Date();
        const todayStr = format(now, "yyyy-MM-dd");
        return flatMyOrbits.filter(orbit => {
            const orbitDate = orbit.date ? orbit.date.split("T")[0] : null;
            if (orbitDate && orbitDate !== todayStr) return false;
            
            // Instant meetings created today should always stay visible
            if (orbit.type === "instant") return true; 
            
            if (orbit.time) {
                const orbitDateTime = new Date(`${orbitDate}T${orbit.time}`);
                // Allow a 15 min buffer so ongoing meetings don't immediately disappear
                return orbitDateTime.getTime() >= (now.getTime() - 15 * 60 * 1000);
            }
            return true;
        });
    }, [flatMyOrbits]);
    
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
            await createOrbit({ title, orbitDate: date, orbitTime: time, type: mode === "now" ? "instant" : "scheduled" });
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
        <div className="h-screen overflow-hidden flex flex-col bg-[#f7f7f4] font-sans">
            <SpacesHeader onJoinOpen={() => setIsJoinOpen(true)} onCreateOpen={() => setIsCreateOpen(true)} />

            <main className="mx-auto w-full max-w-[90rem] px-6 pt-2 pb-6 lg:pt-4 lg:pb-10 lg:px-12 flex-1 flex flex-col overflow-hidden">
                <div className="mb-6 lg:mb-10 sm:hidden flex gap-3 shrink-0">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-8 flex-1 overflow-y-auto xl:overflow-hidden pb-10 xl:pb-0 custom-scrollbar pr-1 xl:pr-0">
                        
                        {/* Left Column */}
                        <div className="md:col-span-1 xl:col-span-3 flex flex-col gap-6 xl:overflow-hidden xl:h-full order-2 xl:order-1">
                            <OrbitCalendar orbits={allActivity} onEdit={setEditingOrbit} />
                        </div>

                        {/* Center Column - My Orbits */}
                        <div className="md:col-span-2 xl:col-span-6 flex flex-col xl:h-full xl:overflow-hidden order-1 xl:order-2">
                            <div className="mb-6 flex items-center justify-between shrink-0">
                                <h2 className="text-2xl font-bold text-[#0d172a]">My Orbits</h2>
                            </div>
                            
                            {displayMyOrbits.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#dfe7f3] bg-white/60 px-6 py-16 text-center">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ebf4ff] text-[#084ba7]"><FiVideo size={22} /></div>
                                    <h3 className="text-lg font-bold text-[#0d172a]">No orbits yet</h3>
                                    <p className="mt-1 max-w-sm text-sm text-[#5b697d]">Orbits you create will show up here.</p>
                                    <button onClick={() => setIsCreateOpen(true)} className="mt-6 rounded-full bg-[#0d172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a2842]">
                                        Create your first Orbit
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-12 gap-4 xl:flex-1 xl:overflow-y-auto xl:pr-2 pb-10 custom-scrollbar content-start">
                                    {displayMyOrbits.map((orbit, index) => {
                                        const isOdd = displayMyOrbits.length % 2 !== 0;
                                        const isFirst = index === 0;
                                        const spanClass = (isOdd && isFirst) ? "col-span-12" : "col-span-12 sm:col-span-6";
                                        
                                        return (
                                            <div key={orbit._id} className={spanClass}>
                                                <MyOrbitCard orbit={orbit} onEdit={setEditingOrbit} />
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Recent Joined Activity (Github style) */}
                        <div className="md:col-span-1 xl:col-span-3 order-3">
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