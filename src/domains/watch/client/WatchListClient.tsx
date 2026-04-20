"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { WatchListToolbar } from "../ui/list";
import WatchListViewTabs from "../ui/list/WatchListViewTabs";
import WatchListFilters from "../ui/list/WatchListFilters";
import WatchListTable from "../ui/list/WatchListTable";
import { buildCounts } from "../ui/list/helpers";
import type { ViewKey, WatchListPageProps, WatchRow } from "../ui/list/types";

function normalizeView(value: string | null | undefined): ViewKey {
    const view = String(value ?? "").toLowerCase();
    if (["draft", "processing", "ready", "hold", "sold", "all"].includes(view)) {
        return view as ViewKey;
    }
    return "draft";
}

function setParam(next: URLSearchParams, key: string, value?: string | null) {
    if (!value) next.delete(key);
    else next.set(key, value);
}

function Pagination({
    page,
    totalPages,
    total,
    onPage,
}: {
    page: number;
    totalPages: number;
    total: number;
    onPage: (page: number) => void;
}) {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
            <div>
                Tổng: <span className="font-semibold text-slate-950">{total}</span> • Trang{" "}
                <span className="font-semibold text-slate-950">{page}</span>/
                <span className="font-semibold text-slate-950">{totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={page <= 1}
                    onClick={() => onPage(Math.max(1, page - 1))}
                >
                    ← Trước
                </button>
                <button
                    type="button"
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    disabled={page >= totalPages}
                    onClick={() => onPage(Math.min(totalPages, page + 1))}
                >
                    Sau →
                </button>
            </div>
        </div>
    );
}

export default function WatchListClient(props: WatchListPageProps) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const rows = props.items ?? [];
    const currentView = useMemo(() => normalizeView(sp.get("view")), [sp]);

    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [filters, setFilters] = useState({
        q: sp.get("q") ?? "",
        sku: sp.get("sku") ?? "",
        brandId: sp.get("brandId") ?? "",
        vendorId: sp.get("vendorId") ?? "",
        hasContent: sp.get("hasContent") ?? "",
        hasImages: sp.get("hasImages") ?? "",
        saleStage: sp.get("saleStage") ?? "",
        opsStage: sp.get("opsStage") ?? "",
        sort: sp.get("sort") ?? "updatedDesc",
    });

    const counts = useMemo(
        () => buildCounts(rows, props.counts),
        [rows, props.counts]
    );
    const activeQuickFilters = useMemo(
        () => ({
            hasContent: filters.hasContent === "yes",
            hasImages: filters.hasImages === "yes",
        }),
        [filters.hasContent, filters.hasImages]
    );

    function pushParams(mutator: (next: URLSearchParams) => void) {
        const next = new URLSearchParams(sp.toString());
        mutator(next);
        router.push(`${pathname}?${next.toString()}`);
    }

    function handleViewChange(view: ViewKey) {
        pushParams((next) => {
            setParam(next, "view", view === "all" ? null : view);
            setParam(next, "page", "1");
        });
    }

    function handleApplyFilters() {
        pushParams((next) => {
            setParam(next, "q", filters.q);
            setParam(next, "sku", filters.sku);
            setParam(next, "brandId", filters.brandId);
            setParam(next, "vendorId", filters.vendorId);
            setParam(next, "hasContent", filters.hasContent);
            setParam(next, "hasImages", filters.hasImages);
            setParam(next, "saleStage", filters.saleStage);
            setParam(next, "opsStage", filters.opsStage);
            setParam(next, "sort", filters.sort);
            setParam(next, "page", "1");
        });
    }

    function handleClearFilters() {
        setFilters({
            q: "",
            sku: "",
            brandId: "",
            vendorId: "",
            hasContent: "",
            hasImages: "",
            saleStage: "",
            opsStage: "",
            sort: "updatedDesc",
        });

        pushParams((next) => {
            [
                "q",
                "sku",
                "brandId",
                "vendorId",
                "hasContent",
                "hasImages",
                "saleStage",
                "opsStage",
            ].forEach((key) => next.delete(key));

            setParam(next, "sort", "updatedDesc");
            setParam(next, "page", "1");
        });
    }

    function handleQuickFilterClick(key: "all" | "hasContent" | "hasImages") {
        if (key === "all") {
            setFilters((prev) => ({
                ...prev,
                hasContent: "",
                hasImages: "",
            }));

            pushParams((next) => {
                next.delete("hasContent");
                next.delete("hasImages");
                setParam(next, "page", "1");
            });
            return;
        }

        const nextValue = filters[key] === "yes" ? "" : "yes";

        setFilters((prev) => ({
            ...prev,
            [key]: nextValue,
        }));

        pushParams((next) => {
            setParam(next, key, nextValue || null);
            setParam(next, "page", "1");
        });
    }

    function handlePage(page: number) {
        pushParams((next) => setParam(next, "page", String(page)));
    }

    function onToggleOne(watchId: string, checked: boolean) {
        setSelectedIds((prev) =>
            checked ? [...new Set([...prev, watchId])] : prev.filter((x) => x !== watchId)
        );
    }

    function onToggleAll(checked: boolean) {
        if (!checked) {
            setSelectedIds([]);
            return;
        }
        setSelectedIds(rows.map((x) => x.id));
    }

    function onView(row: WatchRow) {
        router.push(`/admin/watches/${row.productId}`);
    }

    function onEdit(row: WatchRow) {
        router.push(`/admin/watches/${row.productId}/edit`);
    }

    function onDelete(row: WatchRow) {
        console.log("TODO delete watch", row);
    }

    function onService(row: WatchRow) {
        router.push(`/admin/services/new?productId=${row.productId}`);
    }

    function onQuickOrder(row: WatchRow) {
        router.push(`/admin/orders/new?mode=quick&productId=${row.productId}`);
    }

    function onConsign(row: WatchRow) {
        router.push(`/admin/consignments/new?productId=${row.productId}`);
    }

    const brandOptions = (props.brands ?? []).map((brand) => ({
        label: brand.name,
        value: brand.id,
    }));

    const vendorOptions = (props.vendors ?? []).map((vendor) => ({
        label: vendor.name,
        value: vendor.id,
    }));

    return (
        <div className="space-y-5">
            <WatchListToolbar selectedCount={selectedIds.length} />

            <WatchListViewTabs
                value={currentView}
                counts={counts}
                onChange={handleViewChange}
            />

            <WatchListFilters
                filters={filters}
                brandOptions={brandOptions}
                vendorOptions={vendorOptions}
                onChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
            />

            <WatchListTable
                items={rows}
                selectedIds={selectedIds}
                canViewCost={props.canViewCost}
                counts={{
                    ...counts,
                    hasContent: props.summary?.hasContent ?? 0,
                    hasImages: props.summary?.hasImages ?? 0,
                }}
                activeQuickFilters={activeQuickFilters}
                onQuickFilterClick={handleQuickFilterClick}
                onToggleOne={onToggleOne}
                onToggleAll={onToggleAll}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onService={onService}
                onQuickOrder={onQuickOrder}
                onConsign={onConsign}
            />

            <Pagination
                page={props.page}
                totalPages={props.totalPages}
                total={props.total}
                onPage={handlePage}
            />
        </div>
    );
}