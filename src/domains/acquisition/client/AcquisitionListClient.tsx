"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import AcquisitionEditModal from "@/domains/acquisition/ui/edit/AcquisitionEditModal";
import BusinessListDashboard from "@/domains/shared/ui/business-list/BusinessListDashboard";
import BusinessListShell from "@/domains/shared/ui/business-list/BusinessListShell";
import {
    BusinessListPageHeader,
    DashboardCustomizeButton,
} from "@/domains/shared/ui/business-list";
import type { BusinessListDashboardWidgetKey } from "@/domains/shared/ui/business-list";
import { PackagePlus } from "lucide-react";

import type { AcquisitionListClientProps } from "../ui/list";
import {
    AcquisitionListToolbar,
    AcquisitionListTable,
} from "../ui/list";

const ACQUISITION_DASHBOARD_WIDGETS: BusinessListDashboardWidgetKey[] = [
    "overview",
    "value-trend",
    "status-breakdown",
    "recent-activity",
];

function getBulkPostErrorMessage(data: any) {
    if (!data) return "Có lỗi khi duyệt phiếu!";

    if (Array.isArray(data?.failed) && data.failed.length > 0) {
        return data.failed
            .map((item: any) => `${item?.id || "unknown"}: ${item?.error || "Lỗi không xác định"}`)
            .join("\n");
    }

    return data?.error || "Có lỗi khi duyệt phiếu!";
}

function isSelectable(item: { approvalStatus: string }) {
    return String(item.approvalStatus).toUpperCase() !== "POSTED";
}

export default function AcquisitionListClient(props: AcquisitionListClientProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const notify = useNotify();
    const progress = useAppProgress();

    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [editAcquisitionId, setEditAcquisitionId] = React.useState<string | null>(null);
    const [dashboardCustomizationRequest, setDashboardCustomizationRequest] = React.useState(0);
    React.useEffect(() => {
        setSelectedIds([]);
    }, [sp.toString(), props.page]);

    const selectableIds = React.useMemo(
        () => props.items.filter(isSelectable).map((item) => item.id),
        [props.items],
    );

    function toggleOne(id: string, checked: boolean) {
        setSelectedIds((prev) =>
            checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id),
        );
    }

    function toggleAll(checked: boolean) {
        setSelectedIds(checked ? selectableIds : []);
    }

    async function handleBulkPost() {
        if (!selectedIds.length) return;

        progress.show({
            title: "Đang duyệt phiếu",
            message: `Đang xử lý ${selectedIds.length} phiếu nhập đã chọn.`,
        });

        try {
            const payload = props.items
                .filter((x) => selectedIds.includes(x.id))
                .map((x) => ({ id: x.id, vendor: x.vendorName || "" }));

            const res = await fetch("/api/admin/acquisitions/bulk-post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: payload }),
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                notify.error({
                    title: "Duyệt phiếu thất bại",
                    message: getBulkPostErrorMessage(data),
                    duration: 7000,
                });
                return;
            }

            const postedCount = Number(data?.posted?.length ?? 0);
            const failedCount = Number(data?.failed?.length ?? 0);

            if (failedCount > 0) {
                notify.warning({
                    title: "Duyệt phiếu chưa hoàn tất",
                    message: `Đã duyệt ${postedCount} phiếu, có ${failedCount} phiếu lỗi.\n\n${getBulkPostErrorMessage(data)}`,
                    duration: 7000,
                });
            } else {
                notify.success({
                    title: "Đã duyệt phiếu nhập",
                    message: `Đã duyệt thành công ${postedCount} phiếu.`,
                });
            }

            setSelectedIds([]);
            router.refresh();
        } catch (error) {
            notify.error({
                title: "Duyệt phiếu thất bại",
                message: error instanceof Error ? error.message : "Có lỗi khi duyệt phiếu!",
            });
        } finally {
            progress.hide();
        }
    }

    return (
        <BusinessListShell
            header={
                <BusinessListPageHeader
                    title="Phiếu nhập"
                    icon={<PackagePlus className="h-5 w-5" />}
                    meta={<span>Quản lý nhập kho · Duyệt phiếu và thanh toán đầu vào</span>}
                    actions={
                        <DashboardCustomizeButton
                            onClick={() => setDashboardCustomizationRequest((request) => request + 1)}
                        />
                    }
                />
            }
            dashboard={<BusinessListDashboard
                data={props.dashboardData}
                widgets={ACQUISITION_DASHBOARD_WIDGETS}
                storageKey="admin-dashboard:acquisition-list"
                customizationRequest={dashboardCustomizationRequest}
                showCustomizationTrigger={false}
            />}
            filters={
                <AcquisitionListToolbar
                    vendors={props.vendors}
                    total={props.total}
                    visibleCount={props.items.length}
                    selectedCount={selectedIds.length}
                />
            }
        >

            {selectedIds.length > 0 ? (
                <div className="flex items-center gap-4 rounded-2xl border border-blue-200 bg-blue-50 p-3">
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} phiếu đã chọn
                    </span>

                    <button
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={handleBulkPost}
                        type="button"
                    >
                        Duyệt phiếu
                    </button>

                    <button
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={() => setSelectedIds([])}
                        type="button"
                    >
                        Bỏ chọn
                    </button>
                </div>
            ) : null}

            <AcquisitionListTable
                items={props.items}
                total={props.total}
                page={props.page}
                totalPages={props.totalPages}
                pathname={pathname}
                searchParams={sp}
                selectedIds={selectedIds}
                onToggleOne={toggleOne}
                onToggleAll={toggleAll}
                onOpenEdit={setEditAcquisitionId}
            />

            {editAcquisitionId ? (
                <AcquisitionEditModal
                    open={!!editAcquisitionId}
                    acquisitionId={editAcquisitionId}
                    onClose={() => setEditAcquisitionId(null)}
                    onUpdated={() => router.refresh()}
                />
            ) : null}

        </BusinessListShell>
    );
}
