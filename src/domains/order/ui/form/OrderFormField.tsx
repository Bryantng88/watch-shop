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
            <span className="mb-1 block text-xs font-medium text-slate-500">
                {label}
            </span>
            {children}
        </label>
    );
}
