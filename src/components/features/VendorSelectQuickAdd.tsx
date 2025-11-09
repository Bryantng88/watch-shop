// src/components/VendorSelectQuickAdd.tsx

import React from "react";

type Vendor = {
    id: string;
    name: string;
};

type Props = {

    quickAddData?: { name: string; phone: string; email: string };
    onQuickAddChange?: (field: string, value: string) => void;
    showQuickVendor?: boolean;
    onToggleQuickVendor?: (show: boolean) => void;
};

export function VendorSelectQuickAdd({
    quickAddData,
    onQuickAddChange,
    showQuickVendor,
    onToggleQuickVendor,
}: Props) {
    return (
        <div className="relative w-full">
            <button
                type="button"
                className="w-full h-[42px] rounded border border-gray-300 bg-[#11191f] text-gray-200 text-sm font-medium shadow-sm"
                onClick={() => onToggleQuickVendor && onToggleQuickVendor(!showQuickVendor)}
            >
                {showQuickVendor ? "Ẩn" : "Thêm nhanh"}
            </button>
            {showQuickVendor && (
                <div className="absolute left-0 mt-2 w-64 bg-gray-50 p-4 rounded shadow-lg z-10 border border-gray-200">
                    <div>
                        <label className="block text-xs font-medium mb-1">Tên vendor (quick add)</label>
                        <input
                            className="w-full rounded border px-2 py-1 text-sm mb-2"
                            value={quickAddData?.name ?? ""}
                            onChange={e => onQuickAddChange && onQuickAddChange("name", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Điện thoại</label>
                        <input
                            className="w-full rounded border px-2 py-1 text-sm mb-2"
                            value={quickAddData?.phone ?? ""}
                            onChange={e => onQuickAddChange && onQuickAddChange("phone", e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1">Email</label>
                        <input
                            className="w-full rounded border px-2 py-1 text-sm"
                            value={quickAddData?.email ?? ""}
                            onChange={e => onQuickAddChange && onQuickAddChange("email", e.target.value)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
