import type { ReactNode } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Info,
    XCircle,
} from "lucide-react";

import { cn } from "@/shared/lib/cn";

type Tone = "info" | "success" | "warning" | "danger";

type Props = {
    tone?: Tone;
    title: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    className?: string;
};

const toneMap: Record<
    Tone,
    {
        Icon: typeof Info;
        wrap: string;
        icon: string;
        title: string;
        desc: string;
    }
> = {
    info: {
        Icon: Info,
        wrap: "border-blue-200 bg-blue-50/80",
        icon: "bg-blue-100 text-blue-700 ring-blue-200",
        title: "text-blue-950",
        desc: "text-blue-700",
    },
    success: {
        Icon: CheckCircle2,
        wrap: "border-emerald-200 bg-emerald-50/80",
        icon: "bg-emerald-100 text-emerald-700 ring-emerald-200",
        title: "text-emerald-950",
        desc: "text-emerald-700",
    },
    warning: {
        Icon: AlertTriangle,
        wrap: "border-amber-200 bg-amber-50/90",
        icon: "bg-amber-100 text-amber-700 ring-amber-200",
        title: "text-amber-950",
        desc: "text-amber-700",
    },
    danger: {
        Icon: XCircle,
        wrap: "border-rose-200 bg-rose-50/90",
        icon: "bg-rose-100 text-rose-700 ring-rose-200",
        title: "text-rose-950",
        desc: "text-rose-700",
    },
};

export default function InlineNotice({
    tone = "info",
    title,
    description,
    action,
    className,
}: Props) {
    const meta = toneMap[tone];
    const Icon = meta.Icon;

    return (
        <div
            className={cn(
                "flex items-start justify-between gap-4 rounded-xl border px-4 py-3 shadow-sm",
                meta.wrap,
                className,
            )}
        >
            <div className="flex min-w-0 items-start gap-3">
                <span
                    className={cn(
                        "mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1",
                        meta.icon,
                    )}
                >
                    <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0">
                    <div
                        className={cn(
                            "text-sm font-semibold leading-5",
                            meta.title,
                        )}
                    >
                        {title}
                    </div>

                    {description ? (
                        <div
                            className={cn(
                                "mt-0.5 text-sm leading-5",
                                meta.desc,
                            )}
                        >
                            {description}
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