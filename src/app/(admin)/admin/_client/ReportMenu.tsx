"use client";

import { useEffect, useId, useRef, useState, type ComponentType } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { BarChart3, ChevronDown } from "lucide-react";
import ActiveLink from "./AdminActiveLink";

type ReportLink = {
    href: string;
    label: string;
    icon?: ComponentType<{ size?: number; className?: string }>;
};

type Props = {
    items: ReportLink[];
    expanded: boolean;
    onNavigate: () => void;
};

export default function ReportMenu({ items, expanded, onNavigate }: Props) {
    const pathname = usePathname();
    const id = useId();
    const trigger = useRef<HTMLButtonElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const [groupOpen, setGroupOpen] = useState(true);
    const [railOpen, setRailOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const open = expanded ? groupOpen : railOpen;
    const active = items.some((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

    useEffect(() => { setRailOpen(false); }, [pathname, expanded]);

    useEffect(() => {
        if (!open) return;
        const inside = (target: EventTarget | null) =>
            target instanceof Node && (trigger.current?.contains(target) || panel.current?.contains(target));
        const dismiss = (event: PointerEvent | FocusEvent) => {
            if (!expanded && !inside(event.target)) setRailOpen(false);
        };
        const key = (event: KeyboardEvent) => {
            if (event.key === "Escape" && (!expanded || inside(document.activeElement))) {
                if (expanded) setGroupOpen(false);
                else setRailOpen(false);
                trigger.current?.focus();
            }
        };
        const close = () => setRailOpen(false);
        const scroll = (event: Event) => {
            if (!(event.target instanceof Node) || !panel.current?.contains(event.target)) close();
        };
        document.addEventListener("pointerdown", dismiss);
        document.addEventListener("focusin", dismiss);
        document.addEventListener("keydown", key);
        window.addEventListener("resize", close);
        window.addEventListener("scroll", scroll, true);
        return () => {
            document.removeEventListener("pointerdown", dismiss);
            document.removeEventListener("focusin", dismiss);
            document.removeEventListener("keydown", key);
            window.removeEventListener("resize", close);
            window.removeEventListener("scroll", scroll, true);
        };
    }, [open, expanded]);

    function showRail() {
        const rect = trigger.current?.getBoundingClientRect();
        if (rect) setPosition({
            top: Math.max(8, Math.min(rect.top, window.innerHeight - (items.length * 52 + 64))),
            left: rect.right + 8,
        });
        setRailOpen(true);
    }

    const links = (
        <div
            ref={panel}
            id={id}
            aria-label="Các báo cáo"
            className={expanded ? "mt-1 space-y-1 pl-2" : "fixed z-[100] max-h-[calc(100dvh-16px)] w-60 space-y-1 overflow-y-auto rounded-xl bg-[#11191f] p-2 text-gray-200 shadow-xl"}
            style={expanded ? undefined : position}
        >
            {!expanded && <p className="px-3 py-2 text-xs font-semibold text-white/60">Báo cáo</p>}
            {items.map((item) => {
                const Icon = item.icon ?? BarChart3;
                return (
                    <ActiveLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        title={item.label}
                        expanded
                        onNavigate={() => { setRailOpen(false); onNavigate(); }}
                    >
                        <Icon size={18} className="shrink-0 opacity-80" />
                        <span className="truncate text-[14px] leading-none text-white/75">{item.label}</span>
                    </ActiveLink>
                );
            })}
        </div>
    );

    return (
        <div className="relative pt-3 first:pt-0">
            {!expanded && <div className="mx-auto h-px w-7 bg-white/10" />}
            <button
                ref={trigger}
                type="button"
                aria-label="Báo cáo"
                aria-expanded={open}
                aria-controls={open ? id : undefined}
                title={!expanded ? "Báo cáo" : undefined}
                onClick={() => {
                    if (expanded) setGroupOpen(!groupOpen);
                    else if (railOpen) setRailOpen(false);
                    else showRail();
                }}
                onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                        event.preventDefault();
                        if (expanded) setGroupOpen(true);
                        else showRail();
                        requestAnimationFrame(() => panel.current?.querySelector<HTMLAnchorElement>("a")?.focus());
                    }
                }}
                className={expanded
                    ? "mx-2 flex w-[calc(100%-1rem)] items-center justify-between border-t border-white/10 pt-3 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-white/45 transition hover:text-white/70"
                    : `mt-1 flex h-12 w-full items-center justify-center rounded-xl px-4 text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-400 ${active ? "bg-gray-900 text-white" : ""}`}
            >
                {expanded ? <>
                    <span>Báo cáo</span>
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${groupOpen ? "rotate-0" : "-rotate-90"}`} />
                </> : <BarChart3 size={18} className="shrink-0 opacity-80" />}
            </button>
            {open && (expanded ? links : createPortal(links, document.body))}
        </div>
    );
}
