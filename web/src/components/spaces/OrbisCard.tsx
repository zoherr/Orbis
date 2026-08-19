"use client";
import { FiVideo, FiCalendar, FiMoreHorizontal } from "react-icons/fi";

export interface OrbisItem {
    id: number | string;
    title: string;
    type: "Meeting" | "Space";
    time: string;
    attendees: string[];
    gradient: string;
}

export function OrbisCard({ orbis }: { orbis: OrbisItem }) {
    return (
        <div className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-[#dfe7f3] bg-white p-6 shadow-[0_8px_30px_rgba(8,75,167,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(8,75,167,0.08)]">
            <div className={`absolute left-0 top-0 h-24 w-full bg-gradient-to-b ${orbis.gradient} opacity-50`} />

            <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#dfe7f3] bg-white text-[#084ba7] shadow-sm">
                        {orbis.type === "Meeting" ? <FiVideo size={20} /> : <FiCalendar size={20} />}
                    </div>
                    <button className="text-[#9ca3af] transition-colors hover:text-[#0d172a]" aria-label="More options">
                        <FiMoreHorizontal size={20} />
                    </button>
                </div>

                <h3 className="mb-1 text-lg font-bold text-[#0d172a] transition-colors group-hover:text-[#084ba7]">
                    {orbis.title}
                </h3>
                <p className="mb-8 text-sm font-medium text-[#6a7892]">{orbis.time}</p>

                <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-5">
                    <div className="flex -space-x-3">
                        {orbis.attendees.map((attendee, index) => (
                            <div
                                key={index}
                                className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border-2 border-white bg-[#e2e8f0] text-[10px] font-bold text-[#0d172a] shadow-sm"
                            >
                                {attendee.startsWith("+") ? (
                                    attendee
                                ) : (
                                    <img
                                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${attendee}`}
                                        className="h-full w-full object-cover"
                                        alt={attendee}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <span className="rounded-full bg-[#ebf4ff] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#084ba7]">
                        {orbis.type}
                    </span>
                </div>
            </div>
        </div>
    );
}
