"use client";
import { FiVideo } from "react-icons/fi";
import { OrbisCard, OrbisItem } from "./OrbisCard";

export function RecentOrbisGrid({ items, onCreate }: { items: OrbisItem[]; onCreate: () => void }) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-[#dfe7f3] bg-white/60 px-6 py-16 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#ebf4ff] text-[#084ba7]">
                    <FiVideo size={22} />
                </div>
                <h3 className="text-lg font-bold text-[#0d172a]">No orbits yet</h3>
                <p className="mt-1 max-w-sm text-sm text-[#5b697d]">
                    Meetings and spaces you create or join will show up here.
                </p>
                <button
                    onClick={onCreate}
                    className="mt-6 rounded-full bg-[#0d172a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a2842]"
                >
                    Create your first Orbis
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((orbis) => (
                <OrbisCard key={orbis.id} orbis={orbis} />
            ))}
        </div>
    );
}
