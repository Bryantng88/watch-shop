"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type ToastKind = "success" | "error" | "info" | "warning";

type ToastItem = {
    id: string;
    kind: ToastKind;
    title?: string;
    message: string;
    duration: number;
};

type NotifyInput = string | { title?: string; message: string; duration?: number };

type NotifyApi = {
    success: (input: NotifyInput) => void;
    error: (input: NotifyInput) => void;
    info: (input: NotifyInput) => void;
    warning: (input: NotifyInput) => void;
    dismiss: (id: string) => void;
};

const ToastContext = createContext<NotifyApi | null>(null);

const DEFAULT_DURATION = 3200;

function normalizeInput(input: NotifyInput) {
    if (typeof input === "string") {
        return { message: input, duration: DEFAULT_DURATION };
    }
    return {
        title: input.title,
        message: input.message,
        duration: input.duration ?? DEFAULT_DURATION,
    };
}

function toastStyles(kind: ToastKind) {
    switch (kind) {
        case "success":
            return {
                wrap: "border-emerald-200 bg-emerald-50/90",
                dot: "bg-emerald-500",
                title: "text-emerald-900",
                text: "text-emerald-800",
            };
        case "error":
            return {
                wrap: "border-red-200 bg-red-50/90",
                dot: "bg-red-500",
                title: "text-red-900",
                text: "text-red-800",
            };
        case "warning":
            return {
                wrap: "border-amber-200 bg-amber-50/90",
                dot: "bg-amber-500",
                title: "text-amber-900",
                text: "text-amber-800",
            };
        case "info":
        default:
            return {
                wrap: "border-slate-200 bg-white/95",
                dot: "bg-slate-500",
                title: "text-slate-900",
                text: "text-slate-700",
            };
    }
}

function ToastCard({ item, onClose }: { item: ToastItem; onClose: (id: string) => void }) {
    const styles = toastStyles(item.kind);

    return (
        <div
            className={`pointer-events-auto rounded-xl border px-4 py-3 shadow-lg backdrop-blur transition ${styles.wrap}`}
            role="status"
            aria-live="polite"
        >
            <div className="flex items-start gap-3">
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${styles.dot}`} />

                <div className="min-w-0 flex-1">
                    {item.title ? (
                        <div className={`text-sm font-semibold ${styles.title}`}>{item.title}</div>
                    ) : null}
                    <div className={`text-sm leading-5 ${styles.text}`}>{item.message}</div>
                </div>

                <button
                    type="button"
                    onClick={() => onClose(item.id)}
                    className="shrink-0 rounded p-1 text-slate-400 transition hover:bg-black/5 hover:text-slate-700"
                    aria-label="Đóng thông báo"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}

export function AppToastProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ToastItem[]>([]);

    const dismiss = useCallback((id: string) => {
        setItems((prev) => prev.filter((x) => x.id !== id));
    }, []);

    const push = useCallback(
        (kind: ToastKind, input: NotifyInput) => {
            const normalized = normalizeInput(input);
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            const item: ToastItem = {
                id,
                kind,
                title: normalized.title,
                message: normalized.message,
                duration: normalized.duration,
            };

            setItems((prev) => [...prev, item].slice(-5));

            window.setTimeout(() => {
                dismiss(id);
            }, item.duration);
        },
        [dismiss]
    );

    const value = useMemo<NotifyApi>(
        () => ({
            success: (input) => push("success", input),
            error: (input) => push("error", input),
            info: (input) => push("info", input),
            warning: (input) => push("warning", input),
            dismiss,
        }),
        [dismiss, push]
    );

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="pointer-events-none fixed right-4 top-4 z-[1000] flex w-[380px] max-w-[calc(100vw-2rem)] flex-col gap-3">
                {items.map((item) => (
                    <ToastCard key={item.id} item={item} onClose={dismiss} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useNotify() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useNotify must be used inside <AppToastProvider>");
    }
    return context;
}
