"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type AdminBreadcrumbItem = {
    label: string;
    href?: string;
};

type Props = {
    items: AdminBreadcrumbItem[];
};

export default function AdminBreadcrumbs({ items }: Props) {
    return (
        <nav className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="transition hover:text-slate-900 hover:underline underline-offset-4"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className={isLast ? "font-medium text-slate-700" : ""}>
                                {item.label}
                            </span>
                        )}

                        {!isLast ? <ChevronRight className="h-3.5 w-3.5 text-slate-300" /> : null}
                    </span>
                );
            })}
        </nav>
    );
}