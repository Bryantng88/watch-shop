"use client";

import * as React from "react";

type SectionCardProps = {
    title?: string;
    subtitle?: string;
    right?: React.ReactNode;
    children: React.ReactNode;
    contentClassName?: string;
    className?: string;
};

export default function SectionCard({
    title,
    subtitle,
    right,
    children,
    contentClassName = "p-5",
    className = "",
}: SectionCardProps) {
    return (
        <section className={`overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>
            {(title || subtitle || right) ? (
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                    <div>
                        {title ? <h2 className="text-base font-semibold text-slate-900">{title}</h2> : null}
                        {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
                    </div>
                    {right ? <div className="shrink-0">{right}</div> : null}
                </div>
            ) : null}
            <div className={contentClassName}>{children}</div>
        </section>
    );
}
