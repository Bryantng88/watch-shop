"use client";

type StatusValue =
    | "DRAFT"
    | "POSTED"
    | "ARCHIVED"
    | "SOLD"
    | "HOLD"
    | "PENDING"
    | string;

type Props = {
    status: StatusValue;
    className?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function getMeta(status: StatusValue) {
    switch ((status || "").toUpperCase()) {
        case "POSTED":
            return {
                label: "Posted",
                tone: "bg-emerald-50 text-emerald-700 ring-emerald-100",
            };
        case "DRAFT":
            return {
                label: "Draft",
                tone: "bg-slate-100 text-slate-700 ring-slate-200",
            };
        case "SOLD":
            return {
                label: "Sold",
                tone: "bg-violet-50 text-violet-700 ring-violet-100",
            };
        case "HOLD":
            return {
                label: "Hold",
                tone: "bg-amber-50 text-amber-700 ring-amber-100",
            };
        case "ARCHIVED":
            return {
                label: "Archived",
                tone: "bg-slate-100 text-slate-500 ring-slate-200",
            };
        case "PENDING":
            return {
                label: "Pending",
                tone: "bg-sky-50 text-sky-700 ring-sky-100",
            };
        default:
            return {
                label: status || "-",
                tone: "bg-slate-100 text-slate-600 ring-slate-200",
            };
    }
}

export default function StatusBadge({ status, className }: Props) {
    const meta = getMeta(status);

    return (
        <span
            className={cx(
                "inline-flex h-6 items-center rounded-full px-2.5 text-[11px] font-medium ring-1",
                meta.tone,
                className
            )}
        >
            {meta.label}
        </span>
    );
}