"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
    WatchListBulkBar,
    WatchListFilters,
    WatchListTable,
    WatchListToolbar,
    WatchListViewTabs,
    WatchReadinessModal,
} from "@/domains/watch/ui/list";
import type {
    Counts,
    WatchListPageProps,
    WatchRow,
    ViewKey,
} from "@/domains/watch/ui/list/types";

function normalizeView(value: string | null | undefined): ViewKey {
    const view = String(value ?? "").toLowerCase();
    if (
        ["draft", "processing", "ready", "hold", "sold", "all"].includes(view)
    ) {
        return view as ViewKey;
    }
    return "draft";
}

function buildCounts(total: number, currentView: ViewKey): Counts {
    return {
        draft: currentView === "draft" ? total : 0,
        processing: currentView === "processing" ? total : 0,
        ready: currentView === "ready" ? total : 0,
        hold: currentView === "hold" ? total : 0,
        sold: currentView === "sold" ? total : 0,
        all: currentView === "all" ? total : 0,
    };
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
                Tổng: <span className="font-semibold text-slate-950">{total}</span> •
                Trang <span className="font-semibold text-slate-950">{page}</span>/
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

    const [rows, setRows] = useState<WatchRow[]>(props.items ?? []);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [readinessProduct, setReadinessProduct] = useState<WatchRow | null>(null);

    useEffect(() => {
        setRows(props.items ?? []);
    }, [props.items]);

    const currentView = useMemo<ViewKey>(() => {
        return normalizeView(sp.get("view"));
    }, [sp]);

    const counts = useMemo(
        () => buildCounts(props.total, currentView),
        [props.total, currentView]
    );

    const q = sp.get("q") ?? "";
    const sku = sp.get("sku") ?? "";
    const brandId = sp.get("brandId") ?? "";
    const vendorId = sp.get("vendorId") ?? "";
    const image = sp.get("image") ?? "";
    const sort = sp.get("sort") ?? "";
    const saleStage = sp.get("saleStage") ?? "";
    const opsStage = sp.get("opsStage") ?? "";
    const missing = sp.get("missing") ?? "";

    function pushWith(next: URLSearchParams) {
        router.push(`${pathname}?${next.toString()}`);
    }

    function handleViewChange(view: ViewKey) {
        const next = new URLSearchParams(sp.toString());
        setParam(next, "view", view === "all" ? null : view);
        setParam(next, "page", "1");
        pushWith(next);
    }

    function handleFiltersChange(filters: Record<string, string>) {
        const next = new URLSearchParams(sp.toString());

        setParam(next, "q", filters.q);
        setParam(next, "sku", filters.sku);
        setParam(next, "brandId", filters.brandId);
        setParam(next, "vendorId", filters.vendorId);
        setParam(next, "image", filters.image);
        setParam(next, "sort", filters.sort);
        setParam(next, "saleStage", filters.saleStage);
        setParam(next, "opsStage", filters.opsStage);
        setParam(next, "missing", filters.missing);
        setParam(next, "page", "1");

        pushWith(next);
    }

    function handlePage(page: number) {
        const next = new URLSearchParams(sp.toString());
        setParam(next, "page", String(page));
        pushWith(next);
    }

    function onToggleOne(id: string, checked: boolean) {
        setSelectedIds((prev) =>
            checked ? [...new Set([...prev, id])] : prev.filter((x) => x !== id)
        );
    }

    function onToggleAll(checked: boolean) {
        if (!checked) {
            setSelectedIds([]);
            return;
        }
        setSelectedIds(rows.map((x) => x.id));
    }

    function onView(productId: string) {
        router.push(`/admin/watches/${productId}`);
    }

    function onEdit(productId: string) {
        router.push(`/admin/watches/${productId}/edit`);
    }

    function onDelete(productId: string) {
        console.log("TODO delete watch", productId);
    }

    function onService(productId: string) {
        router.push(`/admin/services/new?productId=${productId}`);
    }

    async function onPriceCommit(
        productId: string,
        field: "minPrice" | "salePrice" | "purchasePrice",
        value: number | null
    ) {
        // TODO: nối route watch pricing mới
        console.log("TODO watch pricing commit", { productId, field, value });
    }

    function onPriceSaved(productId: string, patch: Partial<WatchRow>) {
        setRows((prev) =>
            prev.map((row) => (row.id === productId ? { ...row, ...patch } : row))
        );
    }

    return (
        <div className="space-y-5">
            <WatchListToolbar selectedCount={selectedIds.length} />

            <WatchListViewTabs
                currentView={currentView}
                counts={counts}
                onChange={handleViewChange}
            />

            <WatchListFilters
                values={{
                    q,
                    sku,
                    brandId,
                    vendorId,
                    image,
                    sort,
                    saleStage,
                    opsStage,
                    missing,
                }}
                vendors={props.vendors}
                onChange={handleFiltersChange}
            />

            <WatchListBulkBar
                selectedCount={selectedIds.length}
                onClear={() => setSelectedIds([])}
            />

            <WatchListTable
                items={rows}
                selectedIds={selectedIds}
                canViewCost={props.canViewCost}
                canEditPrice={props.canEditPrice}
                onToggleOne={onToggleOne}
                onToggleAll={onToggleAll}
                onOpenReadiness={setReadinessProduct}
                onPriceSaved={onPriceSaved}
                onPriceCommit={onPriceCommit}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
                onService={onService}
            />

            <Pagination
                page={props.page}
                totalPages={props.totalPages}
                total={props.total}
                onPage={handlePage}
            />

            <WatchReadinessModal
                open={Boolean(readinessProduct)}
                product={readinessProduct}
                onClose={() => setReadinessProduct(null)}
            />
        </div>
    );
}