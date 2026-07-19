"use client";

import { useEffect, useState } from "react";

import BusinessListDashboard, { BusinessListDashboardSkeleton } from "./BusinessListDashboard";
import type {
    BusinessListDashboardData,
    BusinessListDashboardWidgetKey,
} from "./business-list.types";

export default function AsyncBusinessListDashboard({
    endpoint,
    widgets,
    storageKey,
    customizationRequest,
    showCustomizationTrigger,
}: {
    endpoint: string;
    widgets?: BusinessListDashboardWidgetKey[];
    storageKey?: string;
    customizationRequest?: number;
    showCustomizationTrigger?: boolean;
}) {
    const [data, setData] = useState<BusinessListDashboardData | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        void fetch(endpoint, {
            method: "GET",
            headers: { Accept: "application/json" },
            signal: controller.signal,
        })
            .then(async (response) => {
                const result = await response.json().catch(() => null);
                if (!response.ok || !result?.ok) {
                    throw new Error(result?.error || "Không thể tải dashboard");
                }
                setData(result.data);
            })
            .catch((error) => {
                if (error instanceof DOMException && error.name === "AbortError") return;
                console.error("[BUSINESS_LIST_DASHBOARD][LOAD_ERROR]", error);
                setFailed(true);
            });

        return () => controller.abort();
    }, [endpoint]);

    if (failed) return null;
    if (!data) return <BusinessListDashboardSkeleton count={widgets?.length} />;
    return (
        <BusinessListDashboard
            data={data}
            widgets={widgets}
            storageKey={storageKey}
            customizationRequest={customizationRequest}
            showCustomizationTrigger={showCustomizationTrigger}
        />
    );
}
