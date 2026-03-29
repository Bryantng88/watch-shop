"use client";

import { TOAST_DISMISS_EVENT, TOAST_PUSH_EVENT, type NotifyInput } from "@/components/feedback/AppToastProvider";

type NotifyKind = "success" | "error" | "info" | "warning";

function dispatchToast(kind: NotifyKind, input: NotifyInput) {
    if (typeof window === "undefined") {
        return null;
    }

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    window.dispatchEvent(
        new CustomEvent(TOAST_PUSH_EVENT, {
            detail: { kind, input, id },
        })
    );

    return id;
}

export const notify = {
    success(input: NotifyInput) {
        return dispatchToast("success", input);
    },
    error(input: NotifyInput) {
        return dispatchToast("error", input);
    },
    info(input: NotifyInput) {
        return dispatchToast("info", input);
    },
    warning(input: NotifyInput) {
        return dispatchToast("warning", input);
    },
    loading(input: NotifyInput) {
        return dispatchToast("info", input);
    },
    dismiss(id?: string | number) {
        if (typeof window === "undefined" || id == null) return;

        window.dispatchEvent(
            new CustomEvent(TOAST_DISMISS_EVENT, {
                detail: { id: String(id) },
            })
        );
    },
};
