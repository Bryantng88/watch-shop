"use client";

import SegmentTabs from "@/domains/shared/ui/list/SegmentTabs";
import { SERVICE_REQUEST_VIEW_TABS } from "./helpers";
import type { ServiceRequestCounts, ServiceRequestViewKey } from "./types";

type Props = {
    value: ServiceRequestViewKey;
    counts: ServiceRequestCounts;
    onChange: (value: ServiceRequestViewKey) => void;
};

export default function ServiceRequestListViewTabs({ value, counts, onChange }: Props) {
    return (
        <SegmentTabs
            value={value}
            onChange={onChange}
            items={SERVICE_REQUEST_VIEW_TABS.map((tab) => ({
                ...tab,
                count: counts[tab.key] ?? 0,
            }))}
        />
    );
}
