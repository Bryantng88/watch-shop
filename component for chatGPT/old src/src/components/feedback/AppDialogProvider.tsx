"use client";

import * as React from "react";

type DialogTone = "default" | "success" | "warning" | "danger";

type ConfirmOptions = {
    title?: string;
    message: React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    tone?: DialogTone;
};

type AlertOptions = {
    title?: string;
    message: React.ReactNode;
    confirmText?: string;
    tone?: DialogTone;
};

type DialogState =
    | null
    | ({
        type: "confirm";
        resolve: (value: boolean) => void;
    } & ConfirmOptions)
    | ({
        type: "alert";
        resolve: () => void;
    } & AlertOptions);

type AppDialogApi = {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
    alert: (options: AlertOptions) => Promise<void>;
    close: () => void;
};

const AppDialogContext = React.createContext<AppDialogApi | null>(null);

function toneStyles(tone: DialogTone) {
    switch (tone) {
        case "success":
            return {
                badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
                confirm: "bg-emerald-600 hover:bg-emerald-700 text-white",
            };
        case "warning":
            return {
                badge: "bg-amber-100 text-amber-700 border-amber-200",
                confirm: "bg-amber-500 hover:bg-amber-600 text-white",
            };
        case "danger":
            return {
                badge: "bg-red-100 text-red-700 border-red-200",
                confirm: "bg-red-600 hover:bg-red-700 text-white",
            };
        case "default":
        default:
            return {
                badge: "bg-slate-100 text-slate-700 border-slate-200",
                confirm: "bg-slate-900 hover:bg-slate-800 text-white",
            };
    }
}

export function AppDialogProvider({ children }: { children: React.ReactNode }) {
    const [dialog, setDialog] = React.useState<DialogState>(null);

    const close = React.useCallback(() => {
        setDialog(null);
    }, []);

    const confirm = React.useCallback((options: ConfirmOptions) => {
        return new Promise<boolean>((resolve) => {
            setDialog({
                type: "confirm",
                resolve,
                title: options.title,
                message: options.message,
                confirmText: options.confirmText ?? "Xác nhận",
                cancelText: options.cancelText ?? "Hủy",
                tone: options.tone ?? "default",
            });
        });
    }, []);

    const alert = React.useCallback((options: AlertOptions) => {
        return new Promise<void>((resolve) => {
            setDialog({
                type: "alert",
                resolve,
                title: options.title,
                message: options.message,
                confirmText: options.confirmText ?? "Đã hiểu",
                tone: options.tone ?? "default",
            });
        });
    }, []);

    const handleCancel = React.useCallback(() => {
        if (!dialog) return;
        if (dialog.type === "confirm") {
            dialog.resolve(false);
        } else {
            dialog.resolve();
        }
        setDialog(null);
    }, [dialog]);

    const handleConfirm = React.useCallback(() => {
        if (!dialog) return;
        if (dialog.type === "confirm") {
            dialog.resolve(true);
        } else {
            dialog.resolve();
        }
        setDialog(null);
    }, [dialog]);

    const value = React.useMemo<AppDialogApi>(
        () => ({
            confirm,
            alert,
            close,
        }),
        [alert, close, confirm]
    );

    const styles = toneStyles(dialog?.tone ?? "default");

    return (
        <AppDialogContext.Provider value={value}>
            {children}

            {dialog ? (
                <div className="fixed inset-0 z-[1200] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]"
                        onClick={handleCancel}
                    />
                    <div className="relative z-[1] w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
                        <div className="p-5">
                            <div
                                className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
                            >
                                {dialog.type === "confirm" ? "Xác nhận thao tác" : "Thông báo"}
                            </div>

                            {dialog.title ? (
                                <div className="mt-4 text-lg font-semibold text-slate-950">
                                    {dialog.title}
                                </div>
                            ) : null}

                            <div className="mt-2 text-sm leading-6 text-slate-600">
                                {dialog.message}
                            </div>

                            <div className="mt-5 flex flex-wrap justify-end gap-3">
                                {dialog.type === "confirm" ? (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                    >
                                        {dialog.cancelText ?? "Hủy"}
                                    </button>
                                ) : null}

                                <button
                                    type="button"
                                    onClick={handleConfirm}
                                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${styles.confirm}`}
                                >
                                    {dialog.confirmText ?? "Đã hiểu"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </AppDialogContext.Provider>
    );
}

export function useAppDialog() {
    const context = React.useContext(AppDialogContext);
    if (!context) {
        throw new Error("useAppDialog must be used inside <AppDialogProvider>");
    }
    return context;
}