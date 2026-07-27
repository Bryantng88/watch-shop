"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";

import BusinessListDashboard, { BusinessListDashboardSkeleton } from "./BusinessListDashboard";
import type {
    BusinessListDashboardData,
    BusinessListDashboardView,
    BusinessListDashboardWidgetKey,
} from "./business-list.types";

export default function AsyncBusinessListDashboard({
    endpoint,
    widgets,
    storageKey,
    customizationRequest,
    showCustomizationTrigger,
    views = [],
    activeView,
    onViewChange,
    cashFlowPeriods = false,
    onResult,
    initialData,
    preferInitialData = false,
}: {
    endpoint: string;
    widgets?: BusinessListDashboardWidgetKey[];
    storageKey?: string;
    customizationRequest?: number;
    showCustomizationTrigger?: boolean;
    views?: BusinessListDashboardView[];
    activeView?: string;
    onViewChange?: (view: string) => void;
    cashFlowPeriods?: boolean;
    onResult?: (result: unknown) => void;
    initialData?: BusinessListDashboardData | null;
    preferInitialData?: boolean;
}) {
    const initialEndpoint = useRef(endpoint);
    const [data, setData] = useState<BusinessListDashboardData | null>(
        initialData ?? null,
    );
    const [failed, setFailed] = useState(false);
    const [retryKey, setRetryKey] = useState(0);
    const [cashPeriod, setCashPeriod] = useState<"WEEK" | "MONTH" | "YEAR" | "ALL">("WEEK");

    useEffect(() => {
        if (
            retryKey === 0 &&
            initialData &&
            cashPeriod === "WEEK" &&
            (preferInitialData || endpoint === initialEndpoint.current)
        ) {
            setData(initialData);
            setFailed(false);
            return;
        }
        const controller = new AbortController();
        const url = new URL(endpoint, window.location.origin);
        if (cashFlowPeriods) url.searchParams.set("cashPeriod", cashPeriod);
        setData(null);
        setFailed(false);

        void fetch(url.toString(), {
            method: "GET",
            headers: { Accept: "application/json" },
            cache: "no-store",
            signal: controller.signal,
        })
            .then(async (response) => {
                const result = await response.json().catch(() => null);
                if (!response.ok || !result?.ok) {
                    throw new Error(result?.error || "Không thể tải dashboard");
                }
                const nextData = result.data as BusinessListDashboardData;
                if (cashFlowPeriods && nextData.cashFlow) {
                    nextData.cashFlow.onPeriodChange = setCashPeriod;
                }
                onResult?.(result);
                setData(nextData);
            })
            .catch((error) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                if (process.env.NODE_ENV !== "production") {
                    console.warn("[BUSINESS_LIST_DASHBOARD][LOAD_FALLBACK]", error);
                }
                setFailed(true);
            });

        return () => controller.abort();
    }, [
        cashFlowPeriods,
        cashPeriod,
        endpoint,
        initialData,
        onResult,
        preferInitialData,
        retryKey,
    ]);

    if (failed) {
        return (
            <div className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/70">
                <button
                    type="button"
                    onClick={() => setRetryKey((current) => current + 1)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm transition hover:border-violet-200 hover:text-violet-700"
                >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Tải lại dashboard
                </button>
            </div>
        );
    }
    if (!data) return <BusinessListDashboardSkeleton count={widgets?.length} />;
    return (
        <BusinessListDashboard
            data={data}
            widgets={widgets}
            storageKey={storageKey}
            customizationRequest={customizationRequest}
            showCustomizationTrigger={showCustomizationTrigger}
            views={views}
            activeView={activeView}
            onViewChange={onViewChange}
        />
    );
}
