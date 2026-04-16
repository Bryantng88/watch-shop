"use client";
import Link from "next/link";

type Crumb = { label: string; href?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
    return (
        <nav className="mb-4 text-sm text-gray-500">
            <ol className="flex items-center gap-2">
                {items.map((c, i) => {
                    const last = i === items.length - 1;
                    return (
                        <li key={i} className="flex items-center gap-2">
                            {c.href && !last ? (
                                <Link href={c.href} className="hover:text-gray-700">
                                    {c.label}
                                </Link>
                            ) : (
                                <span className="text-gray-700">{c.label}</span>
                            )}
                            {!last && <span className="text-gray-300">/</span>}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
