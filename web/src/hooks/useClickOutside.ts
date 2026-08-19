import { useEffect, RefObject } from "react";

export function useClickOutside<T extends HTMLElement>(
    ref: RefObject<T | null>,
    onOutsideClick: () => void,
    active = true
) {
    useEffect(() => {
        if (!active) return;

        const handleClick = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onOutsideClick();
            }
        };

        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, onOutsideClick, active]);
}
