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
}: {
    href: string;
    children: React.ReactNode;
    exact?: boolean;
    className?: string;
    activeClassName?: string;
}) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname?.startsWith(href);
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-gray-100 hover:bg-gray-800 hover:text-white transition",
                isActive && activeClassName,
                className
            )}
        >
            {children}
        </Link>
    );
}
