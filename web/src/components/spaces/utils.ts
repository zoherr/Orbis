import { format } from "date-fns";
import { Orbit } from "@/store/orbitStore";

export const formatScheduled = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return "";
    const d = new Date(`${dateStr.split("T")[0]}T${timeStr}`);
    return format(d, "dd MMMM yyyy · hh:mm a");
};

export const getOrbitStatus = (orbit: Orbit) => {
    if (!orbit.date || !orbit.time) {
        return { isLive: true, text: "Started just now" };
    }

    const start = new Date(`${orbit.date.split("T")[0]}T${orbit.time}`).getTime();
    const now = Date.now();
    const diffMins = (start - now) / 60000; // positive if in future, negative if in past

    if (diffMins > 30) {
        // More than 30 mins in the future -> Not live yet
        const days = Math.floor(diffMins / 1440);
        const hours = Math.floor((diffMins % 1440) / 60);
        const mins = Math.floor(diffMins % 60);
        
        let text = "";
        if (days > 0) text = `in ${days}d ${hours}h`;
        else if (hours > 0) text = `in ${hours}h ${mins}m`;
        else text = `in ${mins}m`;

        return { isLive: false, text };
    }

    // Within 30 mins or in the past -> It's LIVE!
    if (diffMins > 0) {
        // Starting soon
        return { isLive: true, text: `Starting in ${Math.ceil(diffMins)}m` };
    } else {
        // Started in the past
        const startedAgoMins = Math.abs(diffMins);
        if (startedAgoMins < 5) {
            return { isLive: true, text: "Started just now" };
        }
        
        const h = Math.floor(startedAgoMins / 60);
        const m = Math.floor(startedAgoMins % 60);
        const text = h > 0 ? `Started ${h}h ${m}m ago` : `Started ${m}m ago`;
        
        return { isLive: true, text };
    }
};
