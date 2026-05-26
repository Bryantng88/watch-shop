"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import SegmentTabs from "@/domains/shared/ui/list/SegmentTabs";
import type { AcquisitionListCounts, AcquisitionListView } from "./types";

export default function AcquisitionListTabs({
    counts,
}: {
    counts: AcquisitionListCounts;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const value = (sp.get("view") || "all") as AcquisitionListView;

    function onChange(view: AcquisitionListView) {
        const next = new URLSearchParams(sp.toString());

        if (view === "all") next.delete("view");
        else next.set("view", view);

        next.delete("status");
        next.set("page", "1");

        router.push(`${pathname}?${next.toString()}`);
    }

    return (
        <SegmentTabs<AcquisitionListView>
            value={value}
            onChange={onChange}
            items={[
                { key: "all", label: "Tất cả", count: counts.all },
                { key: "draft", label: "Draft", count: counts.draft },
                { key: "posted", label: "Posted", count: counts.posted },
                { key: "canceled", label: "Canceled", count: counts.canceled },
            ]}
        />
    );
}