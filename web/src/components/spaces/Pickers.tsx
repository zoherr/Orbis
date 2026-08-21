"use client";
import React from "react";
import { FiCalendar, FiClock } from "react-icons/fi";

export function CustomDatePicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    return (
        <div className="relative flex w-full items-center rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm transition focus-within:border-[#5fa3ff] focus-within:ring-4 focus-within:ring-[#5fa3ff]/15">
            <input 
                type="date" 
                value={value} 
                onChange={(e) => onChange(e.target.value)} 
                min={new Date().toISOString().split("T")[0]}
                className="w-full bg-transparent text-[#0d172a] outline-none appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer z-10" 
            />
            <FiCalendar size={16} className="text-[#9aa6b8] absolute right-4 z-0" />
        </div>
    );
}

export function CustomTimePicker({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const [hh, mm] = value ? value.split(":") : ["", ""];
    let h12 = "";
    let ampm = "AM";
    if (hh) {
        let h = parseInt(hh, 10);
        if (h >= 12) { ampm = "PM"; if (h > 12) h -= 12; }
        else if (h === 0) h = 12;
        h12 = h.toString().padStart(2, "0");
    }

    const setTime = (newH: string, newM: string, newAmPm: string) => {
        if (!newH || !newM) return;
        let h24 = parseInt(newH, 10);
        if (newAmPm === "PM" && h24 < 12) h24 += 12;
        if (newAmPm === "AM" && h24 === 12) h24 = 0;
        onChange(`${h24.toString().padStart(2, "0")}:${newM}`);
    };

    return (
        <div className="relative flex w-full items-center justify-between rounded-xl border border-[#dfe7f3] bg-white px-4 py-3 text-sm transition focus-within:border-[#5fa3ff] focus-within:ring-4 focus-within:ring-[#5fa3ff]/15">
            <div className="flex items-center gap-1.5 z-10 w-full">
                <select value={h12} onChange={e => setTime(e.target.value, mm || "00", ampm)} className="bg-transparent text-[#0d172a] outline-none appearance-none cursor-pointer font-medium text-center hover:text-[#084ba7] flex-1">
                    <option value="" disabled>HH</option>
                    {Array.from({length: 12}, (_, i) => i + 1).map(h => <option key={h} value={h.toString().padStart(2, "0")}>{h.toString().padStart(2, "0")}</option>)}
                </select>
                <span className="text-[#9aa6b8] font-bold">:</span>
                <select value={mm} onChange={e => setTime(h12 || "12", e.target.value, ampm)} className="bg-transparent text-[#0d172a] outline-none appearance-none cursor-pointer font-medium text-center hover:text-[#084ba7] flex-1">
                    <option value="" disabled>MM</option>
                    {Array.from({length: 60}, (_, i) => i).filter(m => m % 5 === 0).map(m => <option key={m} value={m.toString().padStart(2, "0")}>{m.toString().padStart(2, "0")}</option>)}
                </select>
                <div className="h-4 w-px bg-[#dfe7f3] mx-1"></div>
                <select value={ampm} onChange={e => setTime(h12 || "12", mm || "00", e.target.value)} className="bg-transparent text-[#084ba7] font-bold outline-none appearance-none cursor-pointer hover:text-[#1d4ed8] flex-1">
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
            <FiClock size={16} className="text-[#9aa6b8] absolute right-4 z-0" />
        </div>
    );
}
