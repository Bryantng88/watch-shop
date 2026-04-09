"use client";

type Tone = "orange" | "green" | "blue" | "gray";

const dotToneMap: Record<Tone, string> = {
    orange: "bg-orange-500",
    green: "bg-emerald-500",
    blue: "bg-blue-500",
    gray: "bg-slate-400",
};

const textToneMap: Record<Tone, string> = {
    orange: "text-orange-600",
    green: "text-emerald-600",
    blue: "text-blue-600",
    gray: "text-slate-500",
};

export default function MiniDotLabel({
    label,
    tone,
    className = "",
}: {
    label: string;
    tone: Tone;
    className?: string;
}) {
    return (
        <span className={`inline-flex items-center gap-1 text-[11px] font-medium leading-4 ${textToneMap[tone]} ${className}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotToneMap[tone]}`} />
            <span>{label}</span>
        </span>
    );
}
