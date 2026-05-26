"use client";

import * as React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
    ListClearButton,
    ListFilterButton,
    ListFilterForm,
    ListSearchInput,
    ListSelect,
} from "@/domains/shared/ui/list/ListFilters";
import type { AcquisitionVendorOption } from "./types";

export default function AcquisitionListToolbar({ vendors }: { vendors: AcquisitionVendorOption[] }) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    const q = sp.get("q") ?? "";
    const vendorId = sp.get("vendorId") ?? "";
    const type = sp.get("type") ?? "";
    const sort = sp.get("sort") ?? "updatedDesc";

    const [formQ, setFormQ] = React.useState(q);
    const [formVendorId, setFormVendorId] = React.useState(vendorId);
    const [formType, setFormType] = React.useState(type);
    const [formSort, setFormSort] = React.useState(sort);

    React.useEffect(() => setFormQ(q), [q]);
    React.useEffect(() => setFormVendorId(vendorId), [vendorId]);
    React.useEffect(() => setFormType(type), [type]);
    React.useEffect(() => setFormSort(sort), [sort]);

    function setParam(next: URLSearchParams, key: string, value: string | null) {
        if (!value) next.delete(key);
        else next.set(key, value);
    }

    function applyFilters(e: React.FormEvent) {
        e.preventDefault();

        const next = new URLSearchParams(sp.toString());
        setParam(next, "q", formQ.trim() || null);
        setParam(next, "vendorId", formVendorId || null);
        setParam(next, "type", formType || null);
        setParam(next, "sort", formSort || "updatedDesc");
        next.set("page", "1");

        router.push(`${pathname}?${next.toString()}`);
    }

    function clearFilters() {
        const next = new URLSearchParams(sp.toString());
        next.delete("q");
        next.delete("vendorId");
        next.delete("type");
        next.delete("sort");
        next.set("page", "1");

        router.push(`${pathname}?${next.toString()}`);
    }

    return (
        <ListFilterForm onSubmit={applyFilters}>
            <ListSearchInput value={formQ} onChange={(e) => setFormQ(e.target.value)} placeholder="Tìm refNo, vendor, item..." />

            <ListSelect
                value={formVendorId}
                onChange={(e) => setFormVendorId(e.target.value)}
                options={[{ value: "", label: "Vendor: tất cả" }, ...vendors.map((vendor) => ({ value: vendor.id, label: vendor.name }))]}
            />

            <ListSelect
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                options={[
                    { value: "", label: "Type: tất cả" },
                    { value: "PURCHASE", label: "Purchase" },
                    { value: "SALE", label: "Sale" },
                    { value: "RETURN", label: "Return" },
                    { value: "BUY_BACK", label: "Buy back" },
                    { value: "TRADE_IN", label: "Trade in" },
                    { value: "CONSIGNMENT", label: "Consignment" },
                ]}
            />

            <ListSelect
                value={formSort}
                onChange={(e) => setFormSort(e.target.value)}
                options={[
                    { value: "updatedDesc", label: "Cập nhật ↓" },
                    { value: "updatedAsc", label: "Cập nhật ↑" },
                    { value: "createdDesc", label: "Tạo ↓" },
                    { value: "createdAsc", label: "Tạo ↑" },
                    { value: "acquiredDesc", label: "Acquired ↓" },
                    { value: "acquiredAsc", label: "Acquired ↑" },
                ]}
            />

            <ListFilterButton>Lọc</ListFilterButton>
            <div className="flex items-center gap-2 lg:justify-end">
                <ListClearButton onClick={clearFilters}>Xóa lọc</ListClearButton>
                <Link
                    href="/admin/acquisitions/new"
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    <Plus className="h-4 w-4" />
                    Tạo phiếu nhập
                </Link>
            </div>
        </ListFilterForm>
    );
}
