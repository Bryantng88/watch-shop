"use client";

import * as React from "react";

export default function DataTableShell({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
            <div className="overflow-x-auto">{children}</div>
        </div>
    );
}
