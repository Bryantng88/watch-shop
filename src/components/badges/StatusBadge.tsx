import React from "react";
import { Badge } from "./Badge";
import type { StatusMeta } from "./StatusMaps";

function fallbackMeta(value: string): StatusMeta {
    return { label: value, tone: "gray" };
}

export function StatusBadge({
    value,
    map,
    className,
}: {
    value: string | null | undefined;
    map: Record<string, StatusMeta>;
    className?: string;
}) {
    if (!value) return <span className="text-gray-400">-</span>;

    const meta = map[value] ?? fallbackMeta(value);
    return (
        <Badge tone={meta.tone} className={className}>
            {meta.label}
        </Badge>
    );
}
