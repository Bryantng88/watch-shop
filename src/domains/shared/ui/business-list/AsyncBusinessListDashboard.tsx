"use client";

import { useEffect, useState } from "react";

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
}) {
    const [data, setData] = useState<BusinessListDashboardData | null>(null);
    const [failed, setFailed] = useState(false);
    const [cashPeriod, setCashPeriod] = useState<"WEEK" | "MONTH" | "YEAR" | "ALL">("WEEK");

    useEffect(() => {
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
                console.error("[BUSINESS_LIST_DASHBOARD][LOAD_ERROR]", error);
                setFailed(true);
            });

        return () => controller.abort();
    }, [cashFlowPeriods, cashPeriod, endpoint, onResult]);

    if (failed) return null;
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
