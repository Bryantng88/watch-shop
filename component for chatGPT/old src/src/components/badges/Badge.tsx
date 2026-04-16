import React from "react";

export type BadgeTone = "gray" | "blue" | "green" | "amber" | "red" | "purple";

function cls(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

export function Badge({
  children,
  tone = "gray",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  const base = "inline-flex items-center rounded px-2 py-0.5 text-xs font-medium";
  const toneCls =
    tone === "blue"
      ? "bg-blue-50 text-blue-700"
      : tone === "green"
        ? "bg-green-50 text-green-700"
        : tone === "amber"
          ? "bg-amber-50 text-amber-700"
          : tone === "red"
            ? "bg-red-50 text-red-700"
            : tone === "purple"
              ? "bg-purple-50 text-purple-700"
              : "bg-gray-100 text-gray-700";

  return <span className={cls(base, toneCls, className)}>{children}</span>;
}
