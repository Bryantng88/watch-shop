import * as React from "react";

export function FilterChip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition ${
        active
          ? "border-stone-300 bg-stone-900 text-white"
          : "border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
      }`}
    >
      {children}
    </button>
  );
}
