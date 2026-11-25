"use client";
import tableStyles from "@/domains/shared/ui/admin-design-contract/AdminBusinessTable.module.css";

import { Plus } from "lucide-react";
import { AdminLinkAction } from "@/domains/shared/ui/admin-design-contract/AdminLinkAction";
import TradingWorkspace from "@/domains/trading/client/TradingWorkspace";
import type { TradingEntry } from "@/domains/trading/shared/trading-navigation";
import { AdminWorkspaceHeading, AdminWorkspaceHeadingRow } from "@/domains/shared/ui/admin-design-contract/AdminWorkspaceHeading";

import { AdminButton } from "@/domains/shared/ui/admin-design-contract/AdminButton";
import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useNotify } from "@/domains/shared/feedback/AppToastProvider";
import { useAppProgress } from "@/domains/shared/feedback/AppProgressProvider";
import AcquisitionEditModal from "@/domains/acquisition/ui/edit/AcquisitionEditModal";
import BusinessListShell from "@/domains/shared/ui/business-list/BusinessListShell";


import type { AcquisitionListClientProps } from "../ui/list";
import {
    AcquisitionListToolbar,
    AcquisitionListTable,
} from "../ui/list";

type BulkPostFailure = {
    id?: string | null;
    error?: string | null;
};

type BulkPostErrorPayload = {
    failed?: BulkPostFailure[] | null;
    error?: string | null;
};

function getBulkPostErrorMessage(data: BulkPostErrorPayload | null) {
    if (!data) return "Có lỗi khi duyệt phiếu!";

    if (Array.isArray(data?.failed) && data.failed.length > 0) {
        return data.failed
            .map((item) => `${item?.id || "unknown"}: ${item?.error || "Lỗi không xác định"}`)
            .join("\n");
    }

    return data?.error || "Có lỗi khi duyệt phiếu!";
}

function isSelectable(item: { approvalStatus: string }) {
    return String(item.approvalStatus).toUpperCase() !== "POSTED";
}

export default function AcquisitionListClient(props: AcquisitionListClientProps & { tradingEntries: TradingEntry[]; strapOnly?: boolean; canManage?: boolean; canViewFinancials?: boolean }) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();
    const notify = useNotify();
    const progress = useAppProgress();

    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
    const [selectedItemsById, setSelectedItemsById] = React.useState<Record<string, (typeof props.items)[number]>>({});
    const [editAcquisitionId, setEditAcquisitionId] = React.useState<string | null>(null);
    const selectionScopeKey = React.useMemo(() => {
        const params = new URLSearchParams(sp.toString());
        params.delete("page");
        return params.toString();
    }, [sp]);
    React.useEffect(() => {
        setSelectedIds([]);
        setSelectedItemsById({});
    }, [selectionScopeKey]);

    React.useEffect(() => {
        const focusId = sp.get("focus")?.trim();
        if (focusId) setEditAcquisitionId(focusId);
    }, [sp]);

    function closeEditAcquisition() {
        setEditAcquisitionId(null);
        if (!sp.has("focus")) return;

        const next = new URLSearchParams(sp.toString());
        next.delete("focus");
        const query = next.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }

    const selectableIds = React.useMemo(
        () => props.canManage ? props.items.filter(isSelectable).map((item) => item.id) : [],
        [props.canManage, props.items],
    );

    function toggleOne(id: string, checked: boolean) {
        if (checked) {
            const row = props.items.find((item) => item.id === id);
            if (row) setSelectedItemsById((prev) => ({ ...prev, [id]: row }));
        } else {
            setSelectedItemsById((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        }
        setSelectedIds((prev) =>
            checked ? Array.from(new Set([...prev, id])) : prev.filter((item) => item !== id),
        );
    }

    function toggleAll(checked: boolean) {
        setSelectedItemsById((prev) => {
            const next = { ...prev };
            for (const row of props.items.filter((item) => selectableIds.includes(item.id))) {
                if (checked) next[row.id] = row;
                else delete next[row.id];
            }
            return next;
        });
        setSelectedIds((prev) =>
            checked
                ? Array.from(new Set([...prev, ...selectableIds]))
                : prev.filter((id) => !selectableIds.includes(id)),
        );
    }

    async function handleBulkPost() {
        if (!selectedIds.length) return;

        progress.show({
            title: "Đang duyệt phiếu",
            message: `Đang xử lý ${selectedIds.length} phiếu nhập đã chọn.`,
            percent: 10,
            steps: selectedIds.map((id) => ({
                id,
                label: selectedItemsById[id]?.refNo || id,
                status: "running" as const,
            })),
        });
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

        try {
            const payload = selectedIds
                .map((id) => selectedItemsById[id])
                .filter((x): x is (typeof props.items)[number] => Boolean(x))
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
        <TradingWorkspace entries={props.tradingEntries} selected="/admin/acquisitions" counts={props.counts}>
        <BusinessListShell className="!px-0 !pt-0 !pb-0"
            header={
                <AdminWorkspaceHeadingRow><AdminWorkspaceHeading>Phiếu nhập</AdminWorkspaceHeading>
                  <AdminLinkAction variant="primary" density="compact" href={props.strapOnly ? "/admin/acquisitions/accessories/new" : "/admin/acquisitions/new"} className="inline-flex items-center gap-2">
                    <Plus className="h-4 w-4" />{props.strapOnly ? "Tạo phiếu phụ kiện" : "Tạo phiếu nhập"}
                  </AdminLinkAction>
                </AdminWorkspaceHeadingRow>
            }
            filters={
                <AcquisitionListToolbar
                    vendors={props.vendors}
                    total={props.total}
                    visibleCount={props.items.length}
                    selectedCount={selectedIds.length}
                    strapOnly={Boolean(props.strapOnly)}
                />
            }
        >

            {selectedIds.length > 0 ? (
                <div className={tableStyles.bulk}>
                    <span className="font-medium text-blue-700">
                        {selectedIds.length} phiếu đã chọn
                    </span>

                    <AdminButton variant="quiet" density="compact"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={handleBulkPost}
                        type="button"
                    >
                        Duyệt phiếu
                    </AdminButton>

                    <AdminButton variant="quiet" density="compact"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm hover:bg-slate-50"
                        onClick={() => setSelectedIds([])}
                        type="button"
                    >
                        Bỏ chọn
                    </AdminButton>
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
                canManage={Boolean(props.canManage)}
                canViewFinancials={Boolean(props.canViewFinancials)}
            />

            {editAcquisitionId ? (
                <AcquisitionEditModal
                    open={!!editAcquisitionId}
                    acquisitionId={editAcquisitionId}
                    canManage={Boolean(props.canManage)}
                    canViewFinancials={Boolean(props.canViewFinancials)}
                    onClose={closeEditAcquisition}
                    onUpdated={() => router.refresh()}
                />
            ) : null}

        </BusinessListShell>
    </TradingWorkspace>
    );
}
