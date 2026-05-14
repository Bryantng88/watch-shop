import type { ReactNode } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Info,
    Lock,
    ShieldAlert,
} from "lucide-react";

type GuardNoticeTone = "info" | "success" | "warning" | "danger" | "locked";
type GuardNoticeIcon = "info" | "success" | "warning" | "lock" | "shield";

type Props = {
    title: string;
    message?: ReactNode;
    tone?: GuardNoticeTone;
    icon?: GuardNoticeIcon;
    action?: ReactNode;
    className?: string;
};

const toneClass: Record<GuardNoticeTone, string> = {
    info: "border-blue-300 bg-gradient-to-r from-blue-50 via-blue-50 to-white text-blue-950 shadow-[0_10px_30px_rgba(37,99,235,0.10)]",
    success: "border-emerald-300 bg-gradient-to-r from-emerald-50 via-emerald-50 to-white text-emerald-950 shadow-[0_10px_30px_rgba(5,150,105,0.12)]",
    warning: "border-amber-300 bg-gradient-to-r from-amber-50 via-amber-50 to-white text-amber-950 shadow-[0_10px_30px_rgba(217,119,6,0.12)]",
    danger: "border-rose-300 bg-gradient-to-r from-rose-50 via-rose-50 to-white text-rose-950 shadow-[0_10px_30px_rgba(225,29,72,0.12)]",
    locked: "border-slate-300 bg-gradient-to-r from-slate-100 via-slate-50 to-white text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.10)]",
};

const accentClass: Record<GuardNoticeTone, string> = {
    info: "bg-blue-500",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    locked: "bg-slate-700",
};

const iconClass: Record<GuardNoticeTone, string> = {
    info: "bg-blue-100 text-blue-700 ring-blue-300 shadow-[0_0_0_4px_rgba(59,130,246,0.18)]",
    success: "bg-emerald-100 text-emerald-700 ring-emerald-300 shadow-[0_0_0_4px_rgba(16,185,129,0.20)]",
    warning: "bg-amber-100 text-amber-700 ring-amber-300 shadow-[0_0_0_4px_rgba(251,191,36,0.22)]",
    danger: "bg-rose-100 text-rose-700 ring-rose-300 shadow-[0_0_0_4px_rgba(244,63,94,0.20)]",
    locked: "bg-slate-200 text-slate-800 ring-slate-300 shadow-[0_0_0_4px_rgba(100,116,139,0.18)]",
};

function defaultIcon(tone: GuardNoticeTone): GuardNoticeIcon {
    if (tone === "info") return "info";
    if (tone === "success") return "success";
    if (tone === "warning") return "warning";
    if (tone === "locked") return "lock";
    return "shield";
}

function getIcon(icon: GuardNoticeIcon) {
    if (icon === "info") return Info;
    if (icon === "success") return CheckCircle2;
    if (icon === "lock") return Lock;
    if (icon === "warning") return AlertTriangle;
    return ShieldAlert;
}

export default function GuardNotice({
    title,
    message,
    tone = "warning",
    icon,
    action,
    className,
}: Props) {
    const Icon = getIcon(icon ?? defaultIcon(tone));

    return (
        <div
            className={[
                "relative overflow-hidden rounded-2xl border px-4 py-3.5",
                "flex items-start justify-between gap-4",
                toneClass[tone],
                className ?? "",
            ].join(" ")}
        >
            <div
                className={[
                    "absolute inset-y-0 left-0 w-1.5",
                    accentClass[tone],
                ].join(" ")}
            />

            <div className="flex min-w-0 items-start gap-3 pl-1.5">
                <div
                    className={[
                        "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1",
                        iconClass[tone],
                    ].join(" ")}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <div className="text-sm font-extrabold tracking-tight">
                        {title}
                    </div>

                    {message ? (
                        <div className="mt-1 text-sm leading-6 opacity-90">
                            {message}
                        </div>
                    ) : null}
                </div>
            </div>

            {action ? (
                <div className="shrink-0 self-center">{action}</div>
            ) : null}
        </div>
    );
}