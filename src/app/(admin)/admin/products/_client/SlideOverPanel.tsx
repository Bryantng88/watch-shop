"use client";

import type { ReactNode } from "react";

export default function SlideOverPanel({
    open,
    title,
    subtitle,
    onClose,
    children,
    widthClass = "max-w-4xl",
}: {
    open: boolean;
    title: string;
    subtitle?: string | null;
    onClose: () => void;
    children: ReactNode;
    widthClass?: string;
}) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/30">
            <div className="absolute inset-0" onClick={onClose} />
            <div className={`absolute right-0 top-0 h-full w-full ${widthClass} bg-white shadow-2xl`}>
                <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
                    <div>
                        <div className="text-lg font-semibold text-gray-900">{title}</div>
                        {subtitle ? <div className="mt-1 text-sm text-gray-500">{subtitle}</div> : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded border px-3 py-1.5 text-sm hover:bg-gray-50"
                    >
                        Đóng
                    </button>
                </div>
                <div className="h-[calc(100%-77px)] overflow-auto p-5">{children}</div>
            </div>
        </div>
    );
}
