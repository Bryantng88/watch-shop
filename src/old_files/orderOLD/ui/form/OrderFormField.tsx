import type { ReactNode } from "react";

export default function OrderFormField({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                {label}
            </span>
            {children}
        </label>
    );
}
