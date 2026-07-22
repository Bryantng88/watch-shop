"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";

import { BusinessListFilterBar } from "@/domains/shared/ui/business-list";
import type { FilterBarField, FilterBarValues } from "@/domains/shared/ui/filter-bar";
import type { AcquisitionVendorOption } from "./types";

const statusField: FilterBarField = {
    key: "status",
    label: "Trạng thái",
    type: "select",
    options: [
        { value: "", label: "Trạng thái: tất cả" },
        { value: "DRAFT", label: "Nháp" },
        { value: "POSTED", label: "Đã nhập kho" },
        { value: "CANCELLED", label: "Đã hủy" },
    ],
};

const typeField: FilterBarField = {
    key: "type",
    label: "Loại phiếu",
    type: "select",
    options: [
        { value: "", label: "Loại phiếu: tất cả" },
        { value: "PURCHASE", label: "Purchase" },
        { value: "BUY_BACK", label: "Buy back" },
        { value: "TRADE_IN", label: "Trade in" },
        { value: "CONSIGNMENT", label: "Consignment" },
    ],
};

const sortField: FilterBarField = {
    key: "sort",
    label: "Sắp xếp",
    type: "select",
    defaultValue: "updatedDesc",
    options: [
        { value: "updatedDesc", label: "Cập nhật mới nhất" },
        { value: "updatedAsc", label: "Cập nhật cũ nhất" },
        { value: "createdDesc", label: "Tạo mới nhất" },
        { value: "createdAsc", label: "Tạo cũ nhất" },
        { value: "acquiredDesc", label: "Ngày nhập mới nhất" },
        { value: "acquiredAsc", label: "Ngày nhập cũ nhất" },
    ],
};

export default function AcquisitionListToolbar({
    vendors,
    total,
    visibleCount,
    selectedCount,
}: {
    vendors: AcquisitionVendorOption[];
    total: number;
    visibleCount: number;
    selectedCount: number;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const paramsKey = searchParams.toString();

    const valuesFromParams = React.useCallback((): FilterBarValues => ({
        q: searchParams.get("q") ?? "",
        vendorId: searchParams.get("vendorId") ?? "",
        type: searchParams.get("type") ?? "",
        status: searchParams.get("status") ?? "",
        sort: searchParams.get("sort") ?? "updatedDesc",
    }), [searchParams]);
    const [values, setValues] = React.useState<FilterBarValues>(valuesFromParams);

    React.useEffect(() => {
        setValues(valuesFromParams());
    }, [paramsKey, valuesFromParams]);

    const primaryFields: FilterBarField[] = [
        {
            key: "vendorId",
            label: "Vendor",
            type: "select",
            options: [
                { value: "", label: "Vendor: tất cả" },
                ...vendors.map((vendor) => ({ value: vendor.id, label: vendor.name })),
            ],
        },
        statusField,
    ];

    function apply(nextValues = values) {
        const next = new URLSearchParams(searchParams.toString());
        next.delete("view");

        for (const key of ["q", "vendorId", "type", "status", "sort"]) {
            const value = nextValues[key]?.trim();
            if (!value || (key === "sort" && value === "updatedDesc")) next.delete(key);
            else next.set(key, value);
        }

        next.set("page", "1");
        router.push(`${pathname}?${next.toString()}`);
    }

    function clearField(key: string) {
        const nextValues = {
            ...values,
            [key]: key === "sort" ? "updatedDesc" : "",
        };
        setValues(nextValues);
        apply(nextValues);
    }

    function clearAll() {
        const nextValues = { q: "", vendorId: "", type: "", status: "", sort: "updatedDesc" };
        setValues(nextValues);
        apply(nextValues);
    }

    return (
        <BusinessListFilterBar
            values={values}
            total={total}
            visibleCount={visibleCount}
            search={{ key: "q", placeholder: "Tìm mã phiếu, vendor hoặc item..." }}
            primaryFields={primaryFields}
            advancedFields={[typeField]}
            sortField={sortField}
            onChange={(patch) => setValues((current) => ({ ...current, ...patch }))}
            onApply={() => apply()}
            onClearField={clearField}
            onClearAll={clearAll}
            trailingActions={
                <>
                    {selectedCount > 0 ? (
                        <span className="whitespace-nowrap rounded-lg bg-blue-50 px-2.5 py-2 text-xs font-semibold text-blue-700">
                            Đã chọn {selectedCount}
                        </span>
                    ) : null}
                    <Link
                        href="/admin/acquisitions/new"
                        className="inline-flex h-11 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-slate-950 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <Plus className="h-4 w-4" />
                        Tạo phiếu nhập
                    </Link>
                </>
            }
        />
    );
}
