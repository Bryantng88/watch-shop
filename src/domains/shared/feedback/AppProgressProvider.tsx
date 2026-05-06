"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

type ProgressOptions = {
    title?: string;
    message?: string;
};

type AppProgressApi = {
    show: (options?: ProgressOptions) => void;
    hide: () => void;
};

type ProgressState = {
    open: boolean;
    title?: string;
    message?: string;
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
    });

    const show = React.useCallback((options?: ProgressOptions) => {
        setState({
            open: true,
            title: options?.title ?? "Đang xử lý",
            message: options?.message ?? "Vui lòng chờ trong giây lát",
        });
    }, []);

    const hide = React.useCallback(() => {
        setState({
            open: false,
            title: "",
            message: "",
        });
    }, []);

    const value = React.useMemo<AppProgressApi>(
        () => ({
            show,
            hide,
        }),
        [show, hide]
    );

    return (
        <AppProgressContext.Provider value={value}>
            {children}

            {state.open ? (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-[1px]" />
                    <div className="relative z-[1] w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
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
                    </div>
                </div>
            ) : null}
        </AppProgressContext.Provider>
    );
}

export function useAppProgress() {
    const context = React.useContext(AppProgressContext);
    if (!context) {
        throw new Error("useAppProgress must be used inside <AppProgressProvider>");
    }
    return context;
}