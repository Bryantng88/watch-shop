"use client";

import Link from "next/link";

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

export type SegmentTab<Key extends string = string> = {
    key: Key;
    label: string;
    count?: number;
    href: string;       // ✅ tab tự có href
    active?: boolean;
};

export default function SegmentTabs<Key extends string = string>({
    tabs,
}: {
    tabs: SegmentTab<Key>[];
}) {
    return (
        <div className="border-b">
            <nav className="-mb-px flex flex-wrap items-center gap-6">
                {tabs.map((t) => {
                    const active = !!t.active;
                    return (
                        <Link
                            key={t.key}
                            href={t.href}
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
