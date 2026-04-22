"use client";

import AcquisitionListRow from "./AcquisitionListRow";
import type { AcquisitionListItem } from "./types";



export default function AcquisitionListTable({
    items,

}: {
    items: AcquisitionListItem[];
}) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
                <thead className="bg-slate-50 text-slate-600">
                    <tr>
                        <th className="px-5 py-3 text-left font-medium">Mã phiếu</th>
                        <th className="px-5 py-3 text-left font-medium">Trạng thái</th>
                        <th className="px-5 py-3 text-left font-medium">Vendor</th>
                        <th className="px-5 py-3 text-left font-medium">
                            Chi tiết acquisition item
                        </th>
                        <th className="px-5 py-3 text-left font-medium">Tổng tiền</th>
                        <th className="px-5 py-3 text-left font-medium">Cập nhật</th>
                        <th className="px-5 py-3 text-left font-medium">Hành động</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) => (
                        <AcquisitionListRow key={item.id} item={item} />
                    ))}

                    {items.length === 0 ? (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-5 py-10 text-center text-sm text-slate-500"
                            >
                                Chưa có dữ liệu phiếu nhập.
                            </td>
                        </tr>
                    ) : null}
                </tbody>
            </table>
        </div>
    );
}