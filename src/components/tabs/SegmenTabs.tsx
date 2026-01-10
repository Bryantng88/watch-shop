"use client";

import Link from "next/link";
import React from "react";

type TabItem<T extends string> = {
    key: T;
    label: string;
    count?: number;
};

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

export default function SegmentTabs<T extends string>({
    tabs,
    current,
    hrefFor,
    className,
}: {
    tabs: TabItem<T>[];
    current: T;
    hrefFor: (key: T) => string;
    className?: string;
}) {
    return (
        <div className={cls("border-b", className)}>
            <nav className="-mb-px flex gap-6">
                {tabs.map((t) => {
                    const active = current === t.key;

                    return (
                        <Link
                            key={t.key}
                            href={hrefFor(t.key)}
                            className={cls(
                                "group inline-flex items-center gap-2 border-b-2 px-1 pb-2 text-sm font-medium",
                                active
                                    ? "border-black text-black"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            <span>{t.label}</span>

                            {typeof t.count === "number" && (
                                <span
                                    className={cls(
                                        "rounded-full px-2 py-0.5 text-xs",
                                        active
                                            ? "bg-black text-white"
                                            : "bg-gray-100 text-gray-700 group-hover:bg-gray-200"
                                    )}
                                >
                                    {t.count}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
