"use client";

import RowActionMenu from "@/app/(admin)/admin/__components/RowActionMenu"
import AcquisitionItemsPreview from "./AcquisitionItemsPreview";
import type { AcquisitionListItem } from "./types";
import { cx, fmtDate, fmtMoney, statusTone } from "./helpers";

export default function AcquisitionListRow({
    item,
}: {
    item: AcquisitionListItem;
}) {
    return (
        <tr className="border-t border-slate-100 align-top">
            <td className="px-5 py-4">
                <div className="font-medium text-slate-950">{item.refNo}</div>
                <div className="mt-1 text-xs text-slate-500">{item.notes || "-"}</div>
            </td>

            <td className="px-5 py-4">
                <span
                    className={cx(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                        statusTone(item.status)
                    )}
                >
                    {item.statusLabel}
                </span>
            </td>

            <td className="px-5 py-4">{item.vendorName}</td>

            <td className="px-5 py-4">
                <AcquisitionItemsPreview row={item} />
            </td>

            <td className="px-5 py-4">{fmtMoney(item.totalAmount)}</td>

            <td className="px-5 py-4">{fmtDate(item.updatedAt)}</td>

            <td className="px-5 py-4">
                <RowActionMenu
                    actions={[
                        {
                            key: "view",
                            label: "Xem chi tiết",
                            href: `/admin/acquisitions/${item.id}`,
                            icon: "view",
                        },
                        {
                            key: "edit",
                            label: "Chỉnh sửa",
                            href: `/admin/acquisitions/${item.id}/edit`,
                            icon: "edit",
                        },
                    ]}
                />
            </td>
        </tr>
    );
}