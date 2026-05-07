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
        "border-amber-300 bg-amber-50 text-amber-900 shadow-[0_0_0_4px_rgba(251,191,36,0.12)]",
    danger:
        "border-rose-300 bg-rose-50 text-rose-900 shadow-[0_0_0_4px_rgba(244,63,94,0.10)]",
    locked:
        "border-slate-300 bg-slate-100 text-slate-900 shadow-[0_0_0_4px_rgba(100,116,139,0.10)]",
};

const iconClass: Record<GuardNoticeTone, string> = {
    warning: "bg-amber-100 text-amber-700 ring-amber-200",
    danger: "bg-rose-100 text-rose-700 ring-rose-200",
    locked: "bg-slate-200 text-slate-700 ring-slate-300",
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
                "rounded-2xl border px-4 py-3",
                "flex items-start justify-between gap-4",
                toneClass[tone],
            ].join(" ")}
        >
            <div className="flex min-w-0 items-start gap-3">
                <div
                    className={[
                        "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1",
                        iconClass[tone],
                    ].join(" ")}
                >
                    <Icon className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                    <div className="text-sm font-bold">{title}</div>
                    {message ? (
                        <div className="mt-1 text-sm leading-6 opacity-85">
                            {message}
                        </div>
                    ) : null}
                </div>
            </div>

            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}