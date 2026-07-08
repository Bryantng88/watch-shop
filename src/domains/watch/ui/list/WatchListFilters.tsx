"use client";

import { FilterBar, type FilterBarField } from "@/domains/shared/ui/filter-bar";

type Option = { label: string; value: string };

type Filters = {
    q: string;
    sku: string;
    brandId: string;
    vendorId: string;
    hasContent: string;
    hasImages: string;
    saleStage: string;
    opsStage: string;
    mediaStatus: string;
    serviceStatus: string;
    saleStatus: string;
    priceStatus: string;
    pricePreset: string;
    priceMin: string;
    priceMax: string;
    sort: string;
};

const sortField: FilterBarField = {
    key: "sort",
    label: "Sắp xếp",
    type: "select",
    defaultValue: "updatedDesc",
    options: [
        { label: "Sắp xếp: Cập nhật mới nhất", value: "updatedDesc" },
        { label: "Sắp xếp: Cập nhật cũ nhất", value: "updatedAsc" },
        { label: "Sắp xếp: Tạo mới nhất", value: "createdDesc" },
        { label: "Sắp xếp: Giá tăng dần", value: "priceAsc" },
        { label: "Sắp xếp: Giá giảm dần", value: "priceDesc" },
        { label: "Sắp xếp: Tên A-Z", value: "titleAsc" },
    ],
};

const advancedFields: FilterBarField[] = [
    {
        key: "mediaStatus",
        label: "Media",
        type: "select",
        options: [
            { label: "Tất cả", value: "" },
            { label: "Đang chụp", value: "PHOTOSHOOT" },
            { label: "Đang xử lý media", value: "MEDIA_PROCESSING" },
            { label: "Sẵn sàng đăng", value: "READY_TO_PUBLISH" },
            { label: "Đã đăng", value: "POSTED" },
            { label: "Cần xử lý lại", value: "NEEDS_REWORK" },
            { label: "Chưa có ảnh", value: "NO_IMAGE" },
        ],
    },
    {
        key: "serviceStatus",
        label: "Service",
        type: "select",
        options: [
            { label: "Tất cả", value: "" },
            { label: "Không cần service", value: "NOT_REQUIRED" },
            { label: "Chờ service", value: "WAITING" },
            { label: "Đang service", value: "IN_SERVICE" },
            { label: "Đã xong", value: "DONE" },
            { label: "Có vấn đề", value: "ISSUE" },
        ],
    },
    {
        key: "saleStatus",
        label: "Bán hàng",
        type: "select",
        options: [
            { label: "Tất cả", value: "" },
            { label: "Sẵn sàng", value: "READY" },
            { label: "Giữ hàng", value: "HOLD" },
            { label: "Đã bán", value: "SOLD" },
            { label: "Consigned", value: "CONSIGNED" },
        ],
    },
    {
        key: "priceStatus",
        label: "Trạng thái giá",
        type: "select",
        options: [
            { label: "Tất cả", value: "" },
            { label: "Chưa có giá", value: "MISSING" },
            { label: "Đã có giá", value: "HAS_PRICE" },
        ],
    },
    {
        key: "pricePreset",
        label: "Khoảng giá",
        type: "select",
        options: [
            { label: "Tất cả", value: "" },
            { label: "Dưới 3tr", value: "UNDER_3M" },
            { label: "Dưới 5tr", value: "UNDER_5M" },
            { label: "5tr - 10tr", value: "FIVE_TO_TEN" },
            { label: "10tr - 20tr", value: "TEN_TO_TWENTY" },
            { label: "Trên 20tr", value: "OVER_TWENTY" },
        ],
    },
    {
        key: "priceMin",
        label: "Từ giá",
        type: "text",
        placeholder: "Ví dụ 5000000",
        inputMode: "numeric",
    },
    {
        key: "priceMax",
        label: "Đến giá",
        type: "text",
        placeholder: "Ví dụ 10000000",
        inputMode: "numeric",
    },
];

export default function WatchListFilters({
    filters,
    total,
    visibleCount,
    brandOptions = [],
    vendorOptions,
    onChange,
    onApply,
    onClear,
    onClearField,
    onSaveView,
}: {
    filters: Filters;
    total?: number;
    visibleCount?: number;
    brandOptions?: Option[];
    vendorOptions: Option[];
    onChange: (patch: Partial<Filters>) => void;
    onApply: () => void;
    onClear: () => void;
    onClearField: (key: string) => void;
    onSaveView?: () => void;
}) {
    const primaryFields: FilterBarField[] = [
        {
            key: "brandId",
            label: "Brand",
            type: "select",
            options: [{ label: "Brand: Tất cả", value: "" }, ...brandOptions],
        },
        {
            key: "vendorId",
            label: "Vendor",
            type: "select",
            options: [{ label: "Vendor: Tất cả", value: "" }, ...vendorOptions],
        },
    ];

    return (
        <FilterBar
            values={filters}
            total={total}
            visibleCount={visibleCount}
            search={{ key: "q", placeholder: "Tìm theo title / brand / model / ref..." }}
            primaryFields={primaryFields}
            advancedFields={advancedFields}
            sortField={sortField}
            onChange={(patch) => onChange(patch as Partial<Filters>)}
            onApply={onApply}
            onClearField={onClearField}
            onClearAll={onClear}
            onSaveView={onSaveView}
        />
    );
}
