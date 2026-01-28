import React from "react";

type DotTone = "green" | "gray" | "blue" | "orange";

function cls(...xs: Array<string | false | null | undefined>) {
    return xs.filter(Boolean).join(" ");
}

export default function DotLabel({
    label,
    tone = "green",
    className,
}: {
    label: string;
    tone?: DotTone;
    className?: string;
}) {
    const dot =
        tone === "blue"
            ? "bg-blue-500"
            : tone === "gray"
                ? "bg-gray-400"
                : tone === "orange"
                    ? "bg-orange-500"
                    : "bg-emerald-500";

    const text =
        tone === "blue"
            ? "text-blue-700"
            : tone === "gray"
                ? "text-gray-600"
                : tone === "orange"
                    ? "text-orange-700"
                    : "text-emerald-700";

    return (
        <div
            className={cls(
                "mt-1 flex items-center gap-1.5 text-[10px]", // ✅ bỏ inline-flex
                text,
                className
            )}
        >
            <span className={cls("h-2 w-2 rounded-full", dot)} />
            <span className="leading-none">{label}</span>
        </div>
    );

}
