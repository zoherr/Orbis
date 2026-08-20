"use client";
import { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import orbitStore, { Orbit } from "@/store/orbitStore";
import toast from "react-hot-toast";

export function CreateOrbisModal({ open, onClose, onCreated }: { open: boolean, onClose: () => void, onCreated?: () => void }) {
    const [mode, setMode] = useState<"now" | "scheduled">("now");
    const [title, setTitle] = useState("Today's Orbit");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const createOrbit = orbitStore(state => state.createOrbit);

    useEffect(() => {
        if (open) {
            const now = new Date();
            setDate(now.toISOString().split("T")[0]);
            setTime(now.toTimeString().slice(0, 5));
            setTitle(mode === "now" ? "Today's Orbit" : "");
        }
    }, [open, mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !date || !time) return toast.error("Fill in all fields.");
        setIsSubmitting(true);
        try {
            await createOrbit({ title: title.trim(), orbitDate: date, orbitTime: time });
            toast.success(mode === "now" ? "Orbit started!" : "Orbit scheduled!");
            onCreated?.();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to create");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Create an Orbit" description="Start a live space now, or schedule one for later.">
            <div className="mb-6 flex gap-2">
                <button type="button" onClick={() => setMode("now")} className={`flex-1 rounded p-2 text-sm font-medium ${mode === "now" ? "bg-[#1a73e8] text-white" : "bg-gray-100 text-gray-700"}`}>Instant</button>
                <button type="button" onClick={() => setMode("scheduled")} className={`flex-1 rounded p-2 text-sm font-medium ${mode === "scheduled" ? "bg-[#1a73e8] text-white" : "bg-gray-100 text-gray-700"}`}>Schedule</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Orbit Title" className="w-full rounded border p-3 outline-none focus:border-[#1a73e8]" />
                {mode === "scheduled" && (
                    <div className="flex gap-4">
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded border p-3 outline-none focus:border-[#1a73e8]" />
                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded border p-3 outline-none focus:border-[#1a73e8]" />
                    </div>
                )}
                <button type="submit" disabled={isSubmitting} className="w-full rounded bg-[#1a73e8] p-3 font-medium text-white hover:bg-[#1b66c9]">{isSubmitting ? "Creating..." : "Create"}</button>
            </form>
        </Modal>
    );
}

export function UpdateOrbisModal({ open, onClose, orbit, onUpdated }: { open: boolean, onClose: () => void, orbit: Orbit | null, onUpdated?: () => void }) {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const updateOrbit = orbitStore(state => state.updateOrbit);

    useEffect(() => {
        if (open && orbit) {
            setTitle(orbit.title);
            if (orbit.date) setDate(orbit.date.split("T")[0]);
            if (orbit.time) setTime(orbit.time);
        }
    }, [open, orbit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orbit || !title.trim() || !date || !time) return toast.error("Fill in all fields.");
        setIsSubmitting(true);
        try {
            await updateOrbit({ _id: orbit._id, title: title.trim(), orbitDate: date, orbitTime: time });
            toast.success("Orbit updated!");
            onUpdated?.();
            onClose();
        } catch (err: any) {
            toast.error(err.message || "Failed to update");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Update Orbit" description="Edit the scheduled orbit details.">
            <form onSubmit={handleSubmit} className="space-y-4">
                <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Orbit Title" className="w-full rounded border p-3 outline-none focus:border-[#1a73e8]" />
                <div className="flex gap-4">
                    <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full rounded border p-3 outline-none focus:border-[#1a73e8]" />
                    <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded border p-3 outline-none focus:border-[#1a73e8]" />
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full rounded bg-[#1a73e8] p-3 font-medium text-white hover:bg-[#1b66c9]">{isSubmitting ? "Updating..." : "Update"}</button>
            </form>
        </Modal>
    );
}
