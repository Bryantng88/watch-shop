// src/components/admin/ActiveLink.tsx
"use client";
import Link, { useLinkStatus } from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createPortal } from "react-dom";

export const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

function NavigationFeedback({ label, expanded }: { label: string; expanded: boolean }) {
    const { pending } = useLinkStatus();
    if (!pending) return null;
    return <>
        <span data-navigation-pending="true" aria-busy="true" className={cn(
            "absolute inset-0 flex items-center rounded-xl bg-slate-800 px-4 text-blue-200",
            expanded ? "justify-start gap-3" : "justify-center min-[2200px]:justify-start min-[2200px]:gap-3",
        )}>
            <Loader2 size={18} className="shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />
            <span className={cn("truncate text-sm", expanded ? "block" : "hidden min-[2200px]:block")}>{label}</span>
        </span>
        {createPortal(<>
        <span role="progressbar" aria-label={`Đang mở ${label}`} className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5 overflow-hidden bg-blue-100">
            <span className="block h-full w-full animate-pulse bg-blue-500 motion-reduce:animate-none" />
        </span>
        <span role="status" className="sr-only">Đang mở {label}…</span>
        </>, document.body)}
    </>;
}

export default function ActiveLink({
    href,
    children,
    exact = false,
    className,
    activeClassName = "bg-gray-900 text-white",
    title,
    expanded = false,
    label,
    onNavigate,
}: {
    href: string;
    children: React.ReactNode;
    exact?: boolean;
    className?: string;
    activeClassName?: string;
    title?: string;
    expanded?: boolean;
    label: string;
    onNavigate?: () => void;
}) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname?.startsWith(href);
    return (
        <Link
            href={href}
            title={title}
            onNavigate={onNavigate}
            onClick={(event) => {
                if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.currentTarget.querySelector("[data-navigation-pending='true']")) event.preventDefault();
            }}
            aria-current={isActive ? "page" : undefined}
            className={cn(
                "relative flex h-12 items-center rounded-xl px-4 text-slate-300 transition hover:bg-white/5 hover:text-white",
                expanded
                    ? "justify-start gap-3"
                    : "justify-center min-[2200px]:justify-start min-[2200px]:gap-3",
                isActive && activeClassName,
                className
            )}
        >
            {children}
            <NavigationFeedback label={label} expanded={expanded} />
        </Link>
    );
}
