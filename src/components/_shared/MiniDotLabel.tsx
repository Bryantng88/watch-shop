"use client";

import * as React from "react";

type Tone =
    | "gray"
    | "slate"
    | "green"
    | "emerald"
    | "amber"
    | "orange"
    | "red"
    | "blue";

type Props = {
    label: React.ReactNode;
    tone?: Tone;
    className?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(" ");
}

function getTone(tone: Tone) {
    switch (tone) {
        case "green":
        case "emerald":
            return {
                dot: "bg-emerald-500",
                text: "text-emerald-700",
            };
        case "amber":
            return {
                dot: "bg-amber-500",
                text: "text-amber-700",
            };
        case "orange":
            return {
                dot: "bg-orange-500",
                text: "text-orange-700",
            };
        case "red":
            return {
                dot: "bg-red-500",
                text: "text-red-700",
            };
        case "blue":
            return {
                dot: "bg-sky-500",
                text: "text-sky-700",
            };
        case "gray":
            return {
                dot: "bg-slate-400",
                text: "text-slate-500",
            };
        case "slate":
        default:
            return {
                dot: "bg-slate-500",
                text: "text-slate-600",
            };
    }
}

export default function MiniDotLabel({
    label,
    tone = "slate",
    className,
}: Props) {
    const ui = getTone(tone);

    return (
        <span
            className={cx(
                "inline-flex items-start gap-1.5 text-[12px] leading-5",
                ui.text,
                className
            )}
        >
            <span className={cx("mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full", ui.dot)} />
            <span>{label}</span>
        </span>
    );
}