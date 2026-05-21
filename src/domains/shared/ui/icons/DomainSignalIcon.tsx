"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DomainSignalIcon({
    icon,
    title,
    withLabel = false,
    label,
    className,
}: {
    icon: ReactNode;
    title?: string;
    withLabel?: boolean;
    label?: string;
    className?: string;
}) {
    return (
        <span
            title={title}
            aria-label={title}
            className={cn(
                "inline-flex h-5 items-center justify-center rounded-full",
                "bg-slate-50 text-slate-500 ring-1 ring-slate-200",
                "text-[11px] font-semibold",
                withLabel ? "gap-1.5 px-2" : "w-5",
                className,
            )}
        >
            <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
            {withLabel && label ? <span>{label}</span> : null}
        </span>
    );
}

export function DomainSignalGroup({ children }: { children: ReactNode }) {
    return <div className="mt-2 flex flex-wrap items-center gap-1.5">{children}</div>;
}