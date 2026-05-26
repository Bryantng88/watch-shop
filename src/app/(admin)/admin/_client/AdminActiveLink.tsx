// src/components/admin/ActiveLink.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

export default function ActiveLink({
    href,
    children,
    exact = false,
    className,
    activeClassName = "bg-gray-900 text-white",
    title,
}: {
    href: string;
    children: React.ReactNode;
    exact?: boolean;
    className?: string;
    activeClassName?: string;
    title?: string;
}) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname?.startsWith(href);
    return (
        <Link
            href={href}
            className={cn(
                "flex h-12 items-center rounded-xl px-4 text-slate-300 transition hover:bg-white/5 hover:text-white",
                "justify-center xl:justify-start xl:gap-3",
                isActive && activeClassName,
                className
            )}
        >
            {children}
        </Link>
    );
}
