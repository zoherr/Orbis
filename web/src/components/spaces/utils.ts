import { format } from "date-fns";

export const formatScheduled = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return "";
    const d = new Date(`${dateStr.split("T")[0]}T${timeStr}`);
    return format(d, "dd MMMM yyyy · hh:mm a");
};

export const countdown = (dateStr?: string, timeStr?: string) => {
    if (!dateStr || !timeStr) return "";
    const d = new Date(`${dateStr.split("T")[0]}T${timeStr}`);
    const diffMs = d.getTime() - Date.now();
    if (diffMs <= 0) return "Starting soon";
    const days = Math.floor(diffMs / 86400000);
    const hours = Math.floor((diffMs % 86400000) / 3600000);
    if (days > 0) return `in ${days}d ${hours}h`;
    const mins = Math.floor((diffMs % 3600000) / 60000);
    return hours > 0 ? `in ${hours}h ${mins}m` : `in ${mins}m`;
};
