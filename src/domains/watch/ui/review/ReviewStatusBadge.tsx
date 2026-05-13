import { CheckCircle2, Clock3, FileText, XCircle } from "lucide-react";

type Props = {
    status?: string | null;
    size?: "sm" | "md";
};

function normalizeStatus(status?: string | null) {
    return String(status ?? "DRAFT").toUpperCase();
}

export function getReviewStatusMeta(status?: string | null) {
    const current = normalizeStatus(status);

    if (current === "SUBMITTED") {
        return {
            label: "Chờ duyệt",
            Icon: Clock3,
            className: "bg-amber-50 text-amber-700",
        };
    }

    if (current === "APPROVED") {
        return {
            label: "Đã duyệt",
            Icon: CheckCircle2,
            className: "bg-emerald-50 text-emerald-700",
        };
    }

    if (current === "REJECTED") {
        return {
            label: "Trả về",
            Icon: XCircle,
            className: "bg-rose-50 text-rose-700",
        };
    }

    return {
        label: "Draft",
        Icon: FileText,
        className: "bg-slate-100 text-slate-600",
    };
}

export default function ReviewStatusBadge({ status, size = "sm" }: Props) {
    const meta = getReviewStatusMeta(status);
    const Icon = meta.Icon;

    return (
        <span
            className={[
                "inline-flex shrink-0 items-center gap-1 rounded-md font-medium",
                meta.className,
                size === "md" ? "px-2 py-1 text-sm" : "px-1.5 py-0.5 text-xs",
            ].join(" ")}
        >
            <Icon className={size === "md" ? "h-3.5 w-3.5" : "h-3 w-3"} />
            {meta.label}
        </span>
    );
}