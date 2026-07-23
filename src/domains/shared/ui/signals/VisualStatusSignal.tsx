"use client";

import type { MouseEventHandler } from "react";
import {
    AlertCircle,
    BadgeCheck,
    Check,
    CircleDot,
    Clock3,
    ImageIcon,
    Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type VisualStatusTone = "slate" | "blue" | "emerald" | "amber" | "rose" | "violet";
export type VisualStatusIcon = "image" | "success" | "warning" | "service" | "waiting" | "neutral";

const TONE_CLASSES: Record<VisualStatusTone, { icon: string; detail: string }> = {
    slate: { icon: "border-slate-200 bg-slate-50 text-slate-400", detail: "text-slate-400" },
    blue: { icon: "border-blue-200 bg-blue-50 text-blue-600", detail: "text-blue-600" },
    emerald: { icon: "border-emerald-200 bg-emerald-50 text-emerald-600", detail: "text-emerald-600" },
    amber: { icon: "border-amber-200 bg-amber-50 text-amber-600", detail: "text-amber-600" },
    rose: { icon: "border-rose-200 bg-rose-50 text-rose-600", detail: "text-rose-600" },
    violet: { icon: "border-violet-200 bg-violet-50 text-violet-600", detail: "text-violet-600" },
};

const ICONS = {
    image: ImageIcon,
    success: BadgeCheck,
    warning: AlertCircle,
    service: Wrench,
    waiting: Clock3,
    neutral: CircleDot,
} satisfies Record<VisualStatusIcon, typeof Check>;

type Props = {
    label: string;
    detail?: string | null;
    tone?: VisualStatusTone;
    icon?: VisualStatusIcon;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    title?: string;
    className?: string;
};

export function VisualStatusSignal({
    label,
    detail,
    tone = "slate",
    icon = "neutral",
    onClick,
    title = label,
    className,
}: Props) {
    const Icon = ICONS[icon];
    const styles = TONE_CLASSES[tone];
    const content = (
        <>
            <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition group-hover:-translate-y-0.5 group-hover:shadow-sm", styles.icon)}>
                <Icon aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={2} />
            </span>
            <span className="min-w-0 text-left">
                <span className="block truncate text-[13px] font-semibold leading-5 text-slate-800">{label}</span>
                {detail ? <span className={cn("mt-0.5 block truncate text-[11px] font-medium leading-4", styles.detail)}>{detail}</span> : null}
            </span>
        </>
    );
    const rootClassName = cn(
        "group inline-flex min-w-[180px] max-w-[220px] items-center gap-3 rounded-xl",
        onClick && "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
        className,
    );

    if (onClick) {
        return <button type="button" onClick={onClick} className={rootClassName} title={title}>{content}</button>;
    }

    return <span className={rootClassName} title={title}>{content}</span>;
}
