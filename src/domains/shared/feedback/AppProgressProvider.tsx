"use client";

import * as React from "react";
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";

export type AppProgressStep = {
    id: string;
    label: string;
    detail?: string;
    status?: "pending" | "running" | "done" | "skipped" | "error";
};

type ProgressOptions = {
    title?: string;
    message?: string;
    percent?: number;
    steps?: AppProgressStep[];
};

type AppProgressApi = {
    show: (options?: ProgressOptions) => void;
    update: (options?: ProgressOptions) => void;
    hide: () => void;
};

type ProgressState = {
    open: boolean;
    title?: string;
    message?: string;
    percent?: number;
    steps: AppProgressStep[];
};

const AppProgressContext = React.createContext<AppProgressApi | null>(null);

export function AppProgressProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [state, setState] = React.useState<ProgressState>({
        open: false,
        title: "",
        message: "",
        percent: undefined,
        steps: [],
    });

    const show = React.useCallback((options?: ProgressOptions) => {
        setState({
            open: true,
            title: options?.title ?? "Đang xử lý",
            message: options?.message ?? "Vui lòng chờ trong giây lát",
            percent: options?.percent,
            steps: options?.steps ?? [],
        });
    }, []);

    const update = React.useCallback((options?: ProgressOptions) => {
        setState((prev) => ({
            ...prev,
            open: true,
            title: options?.title ?? prev.title,
            message: options?.message ?? prev.message,
            percent: options?.percent ?? prev.percent,
            steps: options?.steps ?? prev.steps,
        }));
    }, []);

    const hide = React.useCallback(() => {
        setState({
            open: false,
            title: "",
            message: "",
            percent: undefined,
            steps: [],
        });
    }, []);

    const value = React.useMemo<AppProgressApi>(
        () => ({
            show,
            update,
            hide,
        }),
        [show, update, hide],
    );

    return (
        <AppProgressContext.Provider value={value}>
            {children}

            {state.open ? (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]" />
                    <div className="relative z-[1] w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                                <Loader2 className="h-6 w-6 animate-spin text-slate-700" />
                            </div>

                            <div className="min-w-0">
                                <div className="text-base font-semibold text-slate-950">
                                    {state.title}
                                </div>
                                {state.message ? (
                                    <div className="mt-1 text-sm text-slate-500">
                                        {state.message}
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {state.steps.length ? (
                            <div className="mt-4 max-h-72 space-y-2 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
                                {state.steps.map((step) => (
                                    <div
                                        key={step.id}
                                        className="flex gap-3 rounded-lg bg-white px-3 py-2 shadow-sm"
                                    >
                                        <ProgressStepIcon status={step.status} />
                                        <div className="min-w-0">
                                            <div className="truncate text-sm font-medium text-slate-900">
                                                {step.label}
                                            </div>
                                            {step.detail ? (
                                                <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                                    {step.detail}
                                                </div>
                                            ) : null}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        {typeof state.percent === "number" ? (
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                                    <span>Tiến độ</span>
                                    <span>{Math.max(0, Math.min(100, Math.round(state.percent)))}%</span>
                                </div>
                                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                                        style={{
                                            width: `${Math.max(0, Math.min(100, state.percent))}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}
        </AppProgressContext.Provider>
    );
}

function ProgressStepIcon({
    status,
}: {
    status?: AppProgressStep["status"];
}) {
    if (status === "done") {
        return <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />;
    }

    if (status === "error") {
        return <XCircle className="mt-0.5 h-4 w-4 flex-none text-rose-600" />;
    }

    if (status === "running") {
        return <Loader2 className="mt-0.5 h-4 w-4 flex-none animate-spin text-blue-600" />;
    }

    if (status === "skipped") {
        return <Circle className="mt-0.5 h-4 w-4 flex-none text-amber-500" />;
    }

    return <Circle className="mt-0.5 h-4 w-4 flex-none text-slate-300" />;
}

export function useAppProgress() {
    const context = React.useContext(AppProgressContext);
    if (!context) {
        throw new Error("useAppProgress must be used inside <AppProgressProvider>");
    }
    return context;
}
