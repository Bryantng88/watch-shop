import type { ReactNode } from "react";
import { AlertTriangle, Lock, ShieldAlert } from "lucide-react";

type GuardNoticeTone = "warning" | "danger" | "locked";

type Props = {
    title: string;
    message?: ReactNode;
    tone?: GuardNoticeTone;
    icon?: "warning" | "lock" | "shield";
    action?: ReactNode;
};

const toneClass: Record<GuardNoticeTone, string> = {
    warning:
        "border-amber-300 bg-gradient-to-r from-amber-50 via-amber-50 to-white text-amber-950 shadow-[0_10px_30px_rgba(217,119,6,0.12)]",
    danger:
        "border-rose-300 bg-gradient-to-r from-rose-50 via-rose-50 to-white text-rose-950 shadow-[0_10px_30px_rgba(225,29,72,0.12)]",
    locked:
        "border-slate-300 bg-gradient-to-r from-slate-100 via-slate-50 to-white text-slate-950 shadow-[0_10px_30px_rgba(15,23,42,0.10)]",
};

const accentClass: Record<GuardNoticeTone, string> = {
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    locked: "bg-slate-700",
};

const iconClass: Record<GuardNoticeTone, string> = {
    warning:
        "bg-amber-100 text-amber-700 ring-amber-300 shadow-[0_0_0_4px_rgba(251,191,36,0.22)]",
    danger:
        "bg-rose-100 text-rose-700 ring-rose-300 shadow-[0_0_0_4px_rgba(244,63,94,0.20)]",
    locked:
        "bg-slate-200 text-slate-800 ring-slate-300 shadow-[0_0_0_4px_rgba(100,116,139,0.18)]",
};

export default function GuardNotice({
    title,
    message,
    tone = "warning",
    icon = "shield",
    action,
}: Props) {
    const Icon =
        icon === "lock" ? Lock : icon === "warning" ? AlertTriangle : ShieldAlert;

    return (
        <div
            className={[
                "relative overflow-hidden rounded-2xl border px-4 py-3.5",
                "flex items-start justify-between gap-4",
                toneClass[tone],
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