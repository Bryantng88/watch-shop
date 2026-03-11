"use client";

type Props = {
    status?: string | null;
    className?: string;
};

function getStatusStyle(status?: string | null) {
    const s = (status || "").toUpperCase();

    switch (s) {
        case "PAID":
        case "POSTED":
        case "COMPLETED":
        case "DELIVERED":
        case "DONE":
        case "SOLD":
            return "bg-emerald-50 text-emerald-700 border-emerald-200";

        case "DRAFT":
        case "UNPAID":
            return "bg-gray-50 text-gray-700 border-gray-200";

        case "READY":
        case "PROCESSING":
        case "IN_PROGRESS":
        case "SHIPPED":
        case "DIAGNOSING":
            return "bg-blue-50 text-blue-700 border-blue-200";

        case "HOLD":
        case "RESERVED":
        case "WAIT_APPROVAL":
        case "IN_SERVICE":
            return "bg-orange-50 text-orange-700 border-orange-200";

        case "CANCELLED":
        case "CANCELED":
            return "bg-red-50 text-red-700 border-red-200";

        default:
            return "bg-gray-50 text-gray-700 border-gray-200";
    }
}

export default function StatusBadge({ status, className }: Props) {
    const label = (status || "-").toUpperCase();

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 border rounded-full text-xs font-medium ${getStatusStyle(
                status
            )} ${className || ""}`}
        >
            {label}
        </span>
    );
}